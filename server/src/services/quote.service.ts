import { AppDataSource } from '../db/data-source';
import { Quote } from '../entities/quote.entity';
import { UpsertQuoteInput, MyQuotesQuery } from '../schemas/quote';
import { normalizePage, PageResult } from '../utils/pagination';
import { Case } from '../entities/case.entity';

export const quotesService = {
    /** Upsert a quote: one per (lawyer, case). Status resets to 'proposed' if updated. */
    async upsert(lawyerId: string, body: UpsertQuoteInput): Promise<Quote> {
        const caseRepo = AppDataSource.getRepository(Case);
        const kase = await caseRepo.findOne({ where: { id: body.caseId, status: 'open' } });
        if (!kase) {
            throw Object.assign(new Error('Case not open or not found'), { status: 404 });
        }

        const repo = AppDataSource.getRepository(Quote);
        let q = await repo.findOne({ where: { caseId: body.caseId, lawyerId } });

        if (!q) {
            q = repo.create({
                caseId: body.caseId,
                lawyerId,
                amount: body.amount.toFixed(2), // stored as numeric
                expectedDays: Math.floor(body.expectedDays),
                note: body.note || null,
                status: 'proposed',
            });
        } else {
            q.amount = body.amount.toFixed(2);
            q.expectedDays = Math.floor(body.expectedDays);
            q.note = body.note || null;
            q.status = 'proposed';
        }

        return await repo.save(q);
    },

    async listMine(lawyerId: string, query: MyQuotesQuery): Promise<PageResult<Quote>> {
        const repo = AppDataSource.getRepository(Quote);
        const { page, pageSize, skip, take } = normalizePage(query);

        const qb = repo.createQueryBuilder('q')
            .where('q.lawyerId = :lawyerId', { lawyerId })
            .orderBy('q.updatedAt', 'DESC')
            .skip(skip)
            .take(take);

        if (query.status) qb.andWhere('q.status = :status', { status: query.status });

        const [items, total] = await qb.getManyAndCount();
        return { items, page, pageSize, total };
    },

    async acceptQuote(clientId: string, quoteId: string) {
        const quoteRepo = AppDataSource.getRepository(Quote);
        const caseRepo = AppDataSource.getRepository(Case);

        const quote = await quoteRepo.findOne({
            where: { id: quoteId },
            relations: ['case'],
        });
        if (!quote) throw new Error('Quote not found');
        if (quote.case.clientId !== clientId) throw new Error('Unauthorized');

        // Mark case as engaged with this lawyer
        await caseRepo.update(quote.caseId, {
            status: 'accepted',
            lawyerId: quote.lawyerId,
        });

        // Optionally mark quote as accepted
        await quoteRepo.update(quoteId, { status: 'accepted' });

        return { success: true };
    },
};

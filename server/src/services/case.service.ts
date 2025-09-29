import { AppDataSource } from '../db/data-source';
import { Case, CaseStatus } from '../entities/case.entity';
import { CreateCaseInput, ListMyCasesQuery } from '../schemas/case';
import { redact } from '../utils/redact';
import { normalizePage, PageResult } from '../utils/pagination';

export const casesService = {
    async create(clientId: string, input: CreateCaseInput) {
        const repo = AppDataSource.getRepository(Case);
        const c = repo.create({
            clientId,
            title: input.title,
            category: input.category,
            descriptionFull: input.description,
            descriptionRedacted: redact(input.description),
            status: 'open',
        });
        return await repo.save(c);
    },

    async listMine(clientId: string, query: ListMyCasesQuery): Promise<PageResult<Case>> {
        const repo = AppDataSource.getRepository(Case);
        const { page, pageSize, skip, take } = normalizePage(query);

        const qb = repo.createQueryBuilder('c')
            .where('c.clientId = :clientId', { clientId })
            .orderBy('c.createdAt', 'DESC')
            .skip(skip)
            .take(take);

        if (query.status) {
            qb.andWhere('c.status = :status', { status: query.status });
        }

        const [items, total] = await qb.getManyAndCount();
        return { items, page, pageSize, total };
    },

    async getMineById(clientId: string, caseId: string) {
        const repo = AppDataSource.getRepository(Case);
        const kase = await repo.findOne({ where: { id: caseId, clientId } });
        return kase; // null if not found / not owned
    },

    async updateStatus(caseId: string, status: CaseStatus) {
        const repo = AppDataSource.getRepository(Case);
        await repo.update({ id: caseId }, { status });
    },
    
    async getEngagedCaseByLawyer(lawyerId: string, caseId: string) {
        const repo = AppDataSource.getRepository(Case);
        return await repo.findOne({
            where: { id: caseId, lawyerId, status: 'engaged' },
        });
    }
};

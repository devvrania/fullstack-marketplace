import { AppDataSource } from '../db/data-source';
import { Case } from '../entities/case.entity';
import { MarketplaceQuery } from '../schemas/marketplace';
import { normalizePage, PageResult } from '../utils/pagination';

export const marketplaceService = {
    async listOpen(query: MarketplaceQuery): Promise<PageResult<Pick<Case,
        'id' | 'title' | 'category' | 'createdAt' | 'descriptionRedacted'
    >>> {
        const repo = AppDataSource.getRepository(Case);
        const { page, pageSize, skip, take } = normalizePage(query);

        const qb = repo.createQueryBuilder('c')
            .select(['c.id', 'c.title', 'c.category', 'c.createdAt', 'c.descriptionRedacted'])
            .where('c.status = :open', { open: 'open' })
            .orderBy('c.createdAt', 'DESC')
            .skip(skip)
            .take(take);

        if (query.category) {
            qb.andWhere('c.category ILIKE :cat', { cat: query.category });
        }
        if (query.created_since) {
            qb.andWhere('c.createdAt >= :since', { since: new Date(query.created_since) });
        }

        const [items, total] = await qb.getManyAndCount();
        return { items, page, pageSize, total };
    },
};

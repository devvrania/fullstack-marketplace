import { z } from 'zod';

export const MarketplaceQuerySchema = z.object({
    category: z.string().optional(),
    created_since: z.string().datetime().optional(), // ISO
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
});

export type MarketplaceQuery = z.infer<typeof MarketplaceQuerySchema>;

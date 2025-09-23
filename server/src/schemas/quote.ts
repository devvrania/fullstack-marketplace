import { z } from 'zod';

export const UpsertQuoteSchema = z.object({
    caseId: z.string().uuid(),
    amount: z.coerce.number(),        // frontend will enforce >0 etc.
    expectedDays: z.coerce.number().int(),
    note: z.string().optional(),
});

export const MyQuotesQuerySchema = z.object({
    status: z.enum(['proposed', 'accepted', 'rejected']).optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
});

export type UpsertQuoteInput = z.infer<typeof UpsertQuoteSchema>;
export type MyQuotesQuery = z.infer<typeof MyQuotesQuerySchema>;

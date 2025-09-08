import { z } from 'zod';

export const CreateCaseSchema = z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
});

export const ListMyCasesQuerySchema = z.object({
    status: z.enum(['open', 'engaged', 'closed', 'cancelled']).optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
});

export type CreateCaseInput = z.infer<typeof CreateCaseSchema>;
export type ListMyCasesQuery = z.infer<typeof ListMyCasesQuerySchema>;

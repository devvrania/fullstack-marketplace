import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { casesService } from '../services/case.service';
import { CreateCaseSchema, ListMyCasesQuerySchema } from '../schemas/case';
import { z } from 'zod';

const router = Router();
const IdParamSchema = z.object({ id: z.string().uuid() });

router.post('/cases', requireAuth, requireRole('client'), async (req, res, next) => {
    try {
        const body = CreateCaseSchema.parse(req.body);
        const kase = await casesService.create(req.user!.id, body);
        res.status(201).json({
            id: kase.id,
            title: kase.title,
            category: kase.category,
            status: kase.status,
            createdAt: kase.createdAt,
        });
    } catch (e) { next(e); }
});

router.get('/cases', requireAuth, requireRole('client'), async (req, res, next) => {
    try {
        const q = ListMyCasesQuerySchema.parse(req.query);
        const page = await casesService.listMine(req.user!.id, q);
        res.json(page);
    } catch (e) { next(e); }
});

router.get('/cases/:id', requireAuth, requireRole('client'), async (req, res, next) => {
    try {
        const { id } = IdParamSchema.parse(req.params);
        const kase = await casesService.getMineById(req.user!.id, id);
        if (!kase) return res.status(404).json({ message: 'Case not found' });

        res.json({
            id: kase.id,
            title: kase.title,
            category: kase.category,
            descriptionFull: kase.descriptionFull,
            status: kase.status,
            createdAt: kase.createdAt,
        });
    } catch (e) { next(e); }
});

export { router as clientCasesRouter };

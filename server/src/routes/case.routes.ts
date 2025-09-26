import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { casesService } from '../services/case.service';
import { CreateCaseSchema, ListMyCasesQuerySchema } from '../schemas/case';
import { z } from 'zod';
import { caseFilesService } from '../services/caseFile.service';

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

router.post('/cases/:id/files', requireAuth, requireRole('client'), async (req, res, next) => {
    try {
        console.log('POST /cases/:id/files route hit', req.params, req.body);
        const { id: caseId } = IdParamSchema.parse(req.params);
        // Check if case exists and is owned by user
        const kase = await casesService.getMineById(req.user!.id, caseId);
        if (!kase) return res.status(404).json({ message: 'Case not found' });
        const { filename, originalName, mimeType, size } = req.body;
        const file = await caseFilesService.create(caseId, { filename, originalName, mimeType, size });
        res.status(201).json(file);
    } catch (e) {
        next(e);
    }
});

router.get('/cases/:id/files', requireAuth, requireRole('client'), async (req, res, next) => {
    try {
        console.log('GET /cases/:id/files route hit', req.params);
        const { id: caseId } = IdParamSchema.parse(req.params);
        // Check if case exists and is owned by user
        const kase = await casesService.getMineById(req.user!.id, caseId);
        if (!kase) return res.status(404).json({ message: 'Case not found' });
        const files = await caseFilesService.listByCase(caseId);
        res.json(files);
    } catch (e) {
        next(e);
    }
});

export { router as clientCasesRouter };

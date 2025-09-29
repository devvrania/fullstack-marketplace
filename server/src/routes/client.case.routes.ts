import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { casesService } from '../services/case.service';
import { CreateCaseSchema, ListMyCasesQuerySchema } from '../schemas/case';
import { z } from 'zod';
import { caseFilesService } from '../services/caseFile.service';
import path from 'path';
import fs from 'fs';
import { upload } from '../middleware/upload';
import { caseHistoryService } from '../services/caseHistory.service';

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
        await caseHistoryService.log(kase.id, "created", req.user!.id);
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

router.post(
    '/cases/:id/files',
    requireAuth,
    requireRole('client'),
    upload.single('file'),
    async (req, res, next) => {
        try {
            const { id: caseId } = IdParamSchema.parse(req.params);
            const kase = await casesService.getMineById(req.user!.id, caseId);
            if (!kase) return res.status(404).json({ message: 'Case not found' });
            if (!req.file) return res.status(400).json({ message: 'File required' });

            const file = await caseFilesService.create(caseId, {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
            });

            await caseHistoryService.log(caseId, "file_uploaded", req.user!.id, req.file.originalname);
            res.status(201).json(file);
        } catch (e) {
            next(e);
        }
    }
);

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

router.get('/cases/:id/files/:fileId/download', requireAuth, requireRole('client'), async (req, res, next) => {
    try {
        const caseId = req.params.id;
        const fileId = req.params.fileId;

        if (!fileId || typeof fileId !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing fileId parameter' });
        }

        const file = await caseFilesService.getById(fileId);
        if (!file || file.caseId !== caseId) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Example: assuming you stored files on disk in `uploads/`
        const filePath = path.join(process.cwd(), 'uploads/case-files', file.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(filePath, file.originalName); // forces browser download
    } catch (e) { next(e); }
});

router.post('/cases/:id/close', requireAuth, requireRole('client'), async (req, res, next) => {
    try {
        const { id: caseId } = IdParamSchema.parse(req.params);
        const kase = await casesService.getMineById(req.user!.id, caseId);
        if (!kase) return res.status(404).json({ message: 'Case not found' });

        // Only allow closing if already completed
        if (kase.status !== 'completed') {
            return res.status(400).json({ message: 'Case must be completed by lawyer first' });
        }

        await casesService.updateStatus(caseId, 'closed');

        await caseHistoryService.log(caseId, "closed", req.user!.id, "Client closed case");

        res.json({ success: true, status: 'closed' });
    } catch (e) { next(e); }
});

router.get('/cases/:id/history', requireAuth, async (req, res, next) => {
  try {
    const { id: caseId } = IdParamSchema.parse(req.params);
    const history = await caseHistoryService.listByCase(caseId);
    res.json(history);
  } catch (e) { next(e); }
});

export { router as clientCasesRouter };

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { caseFilesService } from '../services/caseFile.service';
import { z } from 'zod';
import { AppDataSource } from '../db/data-source';
import { Case } from '../entities/case.entity';
import { casesService } from '../services/case.service';
import path from 'path';
import fs from 'fs';
import { caseHistoryService } from '../services/caseHistory.service';

const router = Router();
const IdParamSchema = z.object({ id: z.string().uuid() });

// List files for a case (only if engaged)
router.get('/cases/:id/files', requireAuth, requireRole('lawyer'), async (req, res, next) => {
  try {
    const { id: caseId } = IdParamSchema.parse(req.params);
    const kase = await AppDataSource.getRepository(Case).findOneBy({ id: caseId });

    if (!kase || kase.status !== 'engaged' || kase.lawyerId !== req.user!.id) {
      return res.status(403).json({ message: 'Case not engaged' });
    }

    const files = await caseFilesService.listByCase(caseId);
    res.json(files);
  } catch (e) {
    next(e);
  }
});

// Only engaged lawyer can download
router.get('/cases/:id/files/:fileId/download', requireAuth, requireRole('lawyer'), async (req, res, next) => {
  try {
    // Validate caseId
    const { id: caseId } = IdParamSchema.parse({ id: req.params.id });
    const fileId = req.params.fileId;
    if (!fileId || typeof fileId !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing fileId parameter' });
    }

    // Ensure lawyer is engaged with this case
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized: missing user id' });
    }
    const kase = await casesService.getEngagedCaseByLawyer(req.user!.id, caseId);
    if (!kase) return res.status(403).json({ message: 'Case not engaged' });

    const file = await caseFilesService.getById(fileId);
    if (!file || file.caseId !== caseId) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(process.cwd(), 'uploads/case-files', file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, file.originalName);
  } catch (e) { next(e); }
});

router.post('/cases/:id/complete', requireAuth, requireRole('lawyer'), async (req, res, next) => {
  try {
    const { id: caseId } = IdParamSchema.parse(req.params);

    // Check if this lawyer is engaged
    const kase = await casesService.getEngagedCaseByLawyer(req.user!.id, caseId);
    if (!kase) return res.status(403).json({ message: 'Not engaged with this case' });

    await casesService.updateStatus(caseId, 'completed');

    await caseHistoryService.log(caseId, "completed", req.user!.id, "Lawyer marked as completed");

    res.json({ success: true, status: 'completed' });
  } catch (e) { next(e); }
});

router.get('/cases/:id/history', requireAuth, async (req, res, next) => {
  try {
    const { id: caseId } = IdParamSchema.parse(req.params);
    const history = await caseHistoryService.listByCase(caseId);
    res.json(history);
  } catch (e) { next(e); }
});

export { router as lawyerCasesRouter };

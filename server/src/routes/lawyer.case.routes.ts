import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { caseFilesService } from '../services/caseFile.service';
import { z } from 'zod';

const router = Router();
const IdParamSchema = z.object({ id: z.string().uuid() });

// List files for a case (only if engaged)
router.get('/cases/:id/files', requireAuth, requireRole('lawyer'), async (req, res, next) => {
  try {
    const { id: caseId } = IdParamSchema.parse(req.params);
    const files = await caseFilesService.listByCaseForLawyer(req.user!.id, caseId);
    res.json(files);
  } catch (e) {
    next(e);
  }
});

export { router as lawyerCasesRouter };

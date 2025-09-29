import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { caseFilesService } from '../services/caseFile.service';
import { z } from 'zod';
import { AppDataSource } from '../db/data-source';
import { Case } from '../entities/case.entity';
import { casesService } from '../services/case.service';

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

router.post('/cases/:id/complete', requireAuth, requireRole('lawyer'), async (req, res, next) => {
  try {
    const { id: caseId } = IdParamSchema.parse(req.params);

    // Check if this lawyer is engaged
    const kase = await casesService.getEngagedCaseByLawyer(req.user!.id, caseId);
    if (!kase) return res.status(403).json({ message: 'Not engaged with this case' });

    await casesService.updateStatus(caseId, 'completed');
    res.json({ success: true, status: 'completed' });
  } catch (e) { next(e); }
});

export { router as lawyerCasesRouter };

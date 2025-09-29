import { Router } from "express";
import z from "zod";
import { requireAuth, requireRole } from "../middleware/auth";
import { quotesService } from "../services/quote.service";
import { casesService } from "../services/case.service";

const router = Router();
const IdParamSchema = z.object({ id: z.string().uuid() });
const CaseIdParamSchema = z.object({ caseId: z.string().uuid() });

router.get(
  '/cases/:caseId/quotes',
  requireAuth,
  requireRole('client'),
  async (req, res, next) => {
    try {
      const { caseId } = CaseIdParamSchema.parse(req.params);

      // ensure the case belongs to this client
      const kase = await casesService.getMineById(req.user!.id, caseId);
      if (!kase) return res.status(404).json({ message: 'Case not found' });

      const quotes = await quotesService.listByCase(caseId);
      res.json(quotes);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/quotes/:id/engage',
  requireAuth,
  requireRole('client'),
  async (req, res, next) => {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      const result = await quotesService.acceptQuote(req.user!.id, id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

export { router as clientQuotesRouter };

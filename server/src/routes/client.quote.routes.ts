import { Router } from "express";
import z from "zod";
import { requireAuth, requireRole } from "../middleware/auth";
import { quotesService } from "../services/quote.service";

const router = Router();
const IdParamSchema = z.object({ id: z.string().uuid() });

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

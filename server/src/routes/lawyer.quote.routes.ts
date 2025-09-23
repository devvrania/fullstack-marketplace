import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { UpsertQuoteSchema, MyQuotesQuerySchema } from '../schemas/quote';
import { quotesService } from '../services/quote.service';

const router = Router();

/** POST /lawyer/quotes  (upsert) */
router.post('/quotes', requireAuth, requireRole('lawyer'), async (req, res, next) => {
    try {
        const body = UpsertQuoteSchema.parse(req.body);
        const q = await quotesService.upsert(req.user!.id, body);
        res.status(201).json(q);
    } catch (e) { next(e); }
});

/** GET /lawyer/my-quotes?status=&page=&pageSize= */
router.get('/my-quotes', requireAuth, requireRole('lawyer'), async (req, res, next) => {
    try {
        const q = MyQuotesQuerySchema.parse(req.query);
        const page = await quotesService.listMine(req.user!.id, q);
        res.json(page);
    } catch (e) { next(e); }
});

export { router as lawyerQuotesRouter };

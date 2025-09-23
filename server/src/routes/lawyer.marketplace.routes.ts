import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { MarketplaceQuerySchema } from '../schemas/marketplace';
import { marketplaceService } from '../services/marketplace.service';

const router = Router();

/** GET /lawyer/marketplace?category=&created_since=&page=&pageSize= */
router.get('/marketplace', requireAuth, requireRole('lawyer'), async (req, res, next) => {
    try {
        const q = MarketplaceQuerySchema.parse(req.query);
        const result = await marketplaceService.listOpen(q);
        // Note: no client identity exposed; redacted description only
        res.json(result);
    } catch (e) { next(e); }
});

export { router as lawyerMarketplaceRouter };

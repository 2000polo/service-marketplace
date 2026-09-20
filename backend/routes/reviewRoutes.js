import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { customerOnly } from '../middleware/roleMiddleware.js';
import { createReview, getServiceReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post("/", protect, customerOnly, createReview);
router.get("/service/:serviceId", getServiceReviews);

export default router;
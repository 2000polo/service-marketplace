import express from 'express';
import { providerOnly } from '../middleware/roleMiddleware.js';
import protect from '../middleware/authMiddleware.js';
import { createProviderAvailability, getAvailability, getAvailableSlots, updateAvailability } from '../controllers/availabilityController.js';

const router = express.Router();

router.post('/', protect, providerOnly, createProviderAvailability);
router.put('/', protect, providerOnly, updateAvailability);
router.get('/:providerId', getAvailability);
router.get( '/:providerId/slots', getAvailableSlots);

export default router;
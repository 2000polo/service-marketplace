import express from 'express';
import { createService, getAllServices, getServiceById, updateService, deleteService } from '../controllers/serviceController.js';
import protect from '../middleware/authMiddleware.js';
import { providerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, providerOnly, createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', protect, providerOnly, updateService);
router.delete('/:id', protect, providerOnly, deleteService);

export default router;
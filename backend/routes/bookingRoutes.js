import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { customerOnly } from '../middleware/roleMiddleware.js';
import { createBooking, getBookingById, getBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', protect, customerOnly, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);

export default router;
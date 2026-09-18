import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { customerOnly, providerOnly } from '../middleware/roleMiddleware.js';
import { cancelBooking, createBooking, getBookingById, getBookings, updateBookingStatus } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', protect, customerOnly, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, providerOnly, updateBookingStatus);
router.patch('/:id/cancel', protect, customerOnly, cancelBooking);

export default router;
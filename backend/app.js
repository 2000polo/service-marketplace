import express from "express";
import authRoutes from './routes/authRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import availabilityRoutes from './routes/availabilityRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

const app = express();

app.use(express.json());

app.use('/auth/user', authRoutes);
app.use('/service', serviceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/availability', availabilityRoutes);
app.use('/reviews', reviewRoutes);

app.get('/', ( req, res ) => {
    res.json({message: "hey this is backenddd, hi"})
});

export default app;
import express from "express";
import authRoutes from './routes/authRoutes.js'

const app = express();

app.use(express.json());

app.use('/auth/user', authRoutes);

app.get('/', ( req, res ) => {
    res.json({message: "hey this is backenddd, hi"})
});

export default app;
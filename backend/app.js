import express from "express";

const app = express();

app.use(express.json())

app.get('/', ( req, res ) => {
    res.json({message: "hey this is backenddd, hi"})
});

export default app;
import express from 'express';
import authRoutes from './routes/auth'; // Adjust the path as needed

const app = express();
app.use(express.json()); // Middleware for parsing JSON bodies
app.use('/api', authRoutes); // Use the auth routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

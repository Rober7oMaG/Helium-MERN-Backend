import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './config/database';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';
import PostRoutes from './routes/PostRoutes';

// Create express app
const app = express();

// Enable form data reading
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

// Connect to database
dotenv.config();
connectDatabase();

// Routing
app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);
app.use('/post', PostRoutes);

// Set port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

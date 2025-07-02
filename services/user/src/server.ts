import express from 'express';
import connectDb from './utils/db.js';
import userRoutes from './routes/user.js';
import dotenv from 'dotenv';
import { cloudinaryConfig } from './config/cloudinary.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', userRoutes);

const PORT = process.env.PORT;

cloudinaryConfig();
connectDb();

app.listen(PORT, () => {
    console.log(`User service is running on port ${PORT}`);
    });
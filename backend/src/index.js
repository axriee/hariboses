import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import userRoutes from './routes/userRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';
// import postRoutes from './routes/postRoutes.js';

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

const app = express();

app.use(cors()); 
app.use(express.json());

app.use(clerkMiddleware());    

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/posts", postRoutes);


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const startServer = async () => {   
    try {
        await connectDB();
        app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
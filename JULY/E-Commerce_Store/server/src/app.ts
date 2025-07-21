/*This will do:
    Create Express app
    add middlewares
    Setup base routes
    Export app to index.ts    
*/ 


import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { NotFoundHandler, ErrorHandler } from './middleware/error.middleware';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
//import productRoutes from './routes/product.routes';


const app = express();

//Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON
app.use(morgan('dev')); // Log requests
app.use('/users', userRoutes);
app.use('/admins',adminRoutes);
app.use(NotFoundHandler);
app.use(ErrorHandler);


export default app;
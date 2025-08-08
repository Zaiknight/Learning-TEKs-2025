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
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import itemsRoutes from "./routes/cartItems.routes";
import orderRoutes from "./routes/orders.routes";
import UserAddressRoutes from "./routes/userAddress.route"; 
import orderItemsRoutes from "./routes/orderItems.route";
import paymentsRouter from "./routes/payment.routes";



const app = express();

//Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON
app.use(morgan('dev')); // Log requests
app.use('/users', userRoutes);
app.use('/admins',adminRoutes);
app.use("/categories",categoryRoutes);
app.use("/products",productRoutes);
app.use("/cart", cartRoutes);
app.use("/cartItem", itemsRoutes);
app.use("/order", orderRoutes);
app.use("/orderItem", orderItemsRoutes);
app.use ("/userAddress", UserAddressRoutes);
//image files are in: public/uploads/
app.use('/upload', express.static('public/uploads'));
app.use("/checkout", paymentsRouter);
app.use(NotFoundHandler);
app.use(ErrorHandler);


export default app;
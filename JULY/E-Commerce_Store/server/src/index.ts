/* We will use this file to:
    Load environment and variables
    Connect to db
    Start Express Server
    Handle unexpected errors cleanly
*/

import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

//load env variable

dotenv.config();

const PORT = process.env.PORT || 5000;
const host = process.env.HOST || "localhost";

async function startServer() {
    try {
        //conect pg
        await connectDB();
        console.log("Connection Established ....")

        //start express server
        app.listen(PORT, () => {
            console.log(`Server running on http://${host}:${PORT}`);
        });

    } catch (error) {
        console.error("Unable to start server, returned with error code: " ,error);
        process.exit(1);
    }
}

startServer();
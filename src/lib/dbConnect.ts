import mongoose from "mongoose";

type ConnectionObeject = {
    isConnected?: number | undefined;
    };

const connection : ConnectionObeject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("DB is already connected.");
        return;
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "" , {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected",connection.isConnected);
    }
    catch (e){
        console.log("DB connection failed.",e);
        process.exit(1);
    }
    
}

export default dbConnect;
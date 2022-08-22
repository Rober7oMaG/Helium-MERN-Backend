import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '');

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB connected at: ${url}`);
    } catch (error) {
        // console.log(`Error: ${error.message}`);
        console.log(`Error`);
        process.exit(1);
    }   
};

export default connectDatabase;
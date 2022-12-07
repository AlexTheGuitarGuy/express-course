import mongoose from "mongoose";

const connectDb = async () => {
  const { MONGO_URI } = process.env;

  mongoose.set('strictQuery', false);

  const connection = await mongoose.connect(MONGO_URI);

  console.log(`MongoDB connected on ${connection.connection.host}`);
};

export default connectDb;

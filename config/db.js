import mongoose from "mongoose";

const connectDb = async () => {
  const { MONGO_URI } = process.env;

  mongoose.set("strictQuery", false);

  const connection = await mongoose.connect(MONGO_URI);

  console.log(
    `MongoDB connected at ${connection.connection.host}`.cyan
  );
};

export default connectDb;

let mongoose;

export const connectMongo = async () => {
  if (!mongoose) {
    mongoose = (await import('mongoose')).default;
  }

  if (mongoose.connection.readyState >= 1) return;

  try {
    return mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log("error connecting to mongoDB", e);
  }
};

export default connectMongo;
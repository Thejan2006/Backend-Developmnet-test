import mongoose from 'mongoose';

const uri = "mongodb://admin:1234@ac-htzwu2f-shard-00-00.aojxybi.mongodb.net:27017,ac-htzwu2f-shard-00-01.aojxybi.mongodb.net:27017,ac-htzwu2f-shard-00-02.aojxybi.mongodb.net:27017/dev?ssl=true&replicaSet=atlas-olfxam-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB using standard URI successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err);
    process.exit(1);
  });

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const testConnections = async () => {
//     console.log('🔍 Testing MongoDB connections...\n');
    
//     // Option 1: SRV connection (original)
//     const srvUri = process.env.MONGO_URI;
    
//     // Option 2: Direct connection
//     const directUri = 'mongodb://admin:1234@ac-htzwu2f-shard-00-00.aojxybi.mongodb.net:27017,ac-htzwu2f-shard-00-01.aojxybi.mongodb.net:27017,ac-htzwu2f-shard-00-02.aojxybi.mongodb.net:27017/dev?ssl=true&replicaSet=atlas-olfxam-shard-0&authSource=admin&retryWrites=true&w=majority';
    
//     // Option 3: Local MongoDB
//     const localUri = 'mongodb://localhost:27017/dev';
    
//     console.log('1. Testing Direct Connection...');
//     try {
//         await mongoose.connect(directUri, { serverSelectionTimeoutMS: 5000 });
//         console.log('✅ Direct Connection SUCCESSFUL!');
//         await mongoose.disconnect();
//     } catch (error) {
//         console.log('❌ Direct Connection FAILED:', error.message);
//     }
    
//     console.log('\n2. Testing Local MongoDB...');
//     try {
//         await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
//         console.log('✅ Local Connection SUCCESSFUL!');
//         await mongoose.disconnect();
//     } catch (error) {
//         console.log('❌ Local Connection FAILED:', error.message);
//         console.log('   💡 Tip: Install MongoDB locally first');
//     }
// };

// testConnections();
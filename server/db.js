const mongoose = require('mongoose');
const uri = "mongodb+srv://jamjam:jamjamjam123@cluster0.z9pyd3y.mongodb.net/?retryWrites=true&w=majority"



const connectToDatabase = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.log(err.message);
        process.exit(0);
    }
}




module.exports = connectToDatabase;

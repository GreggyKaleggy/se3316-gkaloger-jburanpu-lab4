const mongoose = require('mongoose');
//get mongo uri from env file
const uri = process.env.MONGO_URI;


//connecting to database
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

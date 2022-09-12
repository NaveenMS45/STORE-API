require('dotenv').config();
const product = require('./models/product')

const jsonProduct = require('./products.json')
const connectDB = require('./DB/connect')


const start = async() =>{
    try{
        //connect to db
        await connectDB(process.env.MONGO_URI)
        await product.deleteMany()
        await product.create(jsonProduct)
        console.log(`success!!!`);
        process.exit(0)
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

start()


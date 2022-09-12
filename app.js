require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()


const connectDB = require('./DB/connect')
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/notfound');
const errorMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());

// routes

app.get('/',(req,res) => {
    res.send(`<h1>HOME PAGE</h1><a href='/api/v1/products'>Products page</a>`)
})

app.use('/api/v1/products',productsRouter)
//products route

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
const start = async() => {
    try {
        //connect to db
        await connectDB(process.env.MONGO_URI)
        app.listen(port,(req,res) => {
            console.log(`server is listening on port ${port}.... `);
        })
    } catch (err) {
        console.log(err)
    }

}

start()

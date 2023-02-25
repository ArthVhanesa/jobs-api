require('dotenv').config()
require('express-async-errors')

// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


app.set('trust proxy', 1)

app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}))

// Middleware for json
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res) => {
    res.send('my api world')
})
// Route for API 
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

// Middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const PORT = process.env.PORT || 5000

// Written in start function as we want to spin up the server only if the db is connected
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)

        // If the DB connection is successful then server will start listen
        app.listen(PORT, () => {
            console.log(`server is listening on ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

// Invoking the start function for connect the db and start the server
start();
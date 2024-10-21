import express from 'express'
// import cors from 'cors'
import csvParser from 'csv-parser'
import { config } from 'dotenv'
import errorMiddleware from './middlewares/error.middleware.js'
import morgan from 'morgan'
config()

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use(morgan('dev'))

app.use('/test', function (req, res) {
    res.send("Test is successful")
})

app.all('*', (req, res) => {
    res.status(404).send('OOPS! Page not found')
})

app.use(errorMiddleware)

export default app
import express from 'express'
// import cors from 'cors'
import csvParser from 'csv-parser'
import { config } from 'dotenv'
import errorMiddleware from './middlewares/error.middleware.js'
import morgan from 'morgan'
import { getCloseAverage, getHighestVolume, getVWAPAverage, uploadData } from './controllers/stock.controller.js'
import upload from './middlewares/multer.middleware.js'
config()

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use(morgan('dev'))

app.use('/test', function (req, res) {
    res.send("Test is successful")
})

app.post('/api/upload', upload.single('fileData'), uploadData)
app.get('/api/highest_volume', getHighestVolume)
app.get('/api/average_close', getCloseAverage)
app.get('/api/average_vwap', getVWAPAverage)

app.all('*', (req, res) => {
    res.status(404).send('OOPS! Page not found')
})

app.use(errorMiddleware)

export default app
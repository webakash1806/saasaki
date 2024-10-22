import express from 'express'
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

app.use('/start', function (req, res) {
    res.send("Server started")
})

// Endpoint for file upload
app.post('/api/upload', upload.single('fileData'), uploadData)

// Endpoint for highest volume
app.get('/api/highest_volume', getHighestVolume)

// Endpoint for average close
app.get('/api/average_close', getCloseAverage)

// Endpoint for average vwap
app.get('/api/average_vwap', getVWAPAverage)


// Endpoint for 404 page
app.all('*', (req, res) => {
    res.status(404).send('OOPS! Page not found')
})

app.use(errorMiddleware)

export default app
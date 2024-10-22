import mongoose, { model } from "mongoose";

// Create schema based on the stock data structure
const stockSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    symbol: {
        type: String,
    },
    series: {
        type: String,
    },
    prev_close: {
        type: Number,
    },
    open: {
        type: Number,
    },
    high: {
        type: Number,
    },
    low: {
        type: Number,
    },
    last: {
        type: Number,
    },
    close: {
        type: Number,
    },
    vwap: {
        type: Number,
    },
    volume: {
        type: Number,
    },
    turnover: {
        type: Number,
    },
    trades: {
        type: Number,
    },
    deliverable: {
        type: Number,
    },
    percent_deliverable: {
        type: Number,
    },
});

const StockData = model('StockData', stockSchema)

export default StockData
import AppError from '../utils/error.utils.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import StockData from '../models/stock.model.js';

// Function to upload the CSV file

const uploadData = async (req, res, next) => {
    try {
        const results = [];
        const invalidRows = [];
        const filePath = req.file.path;
        let totalRows = 0

        console.log(`Processing file: ${filePath}`);

        // Mapping of CSV headers
        const headerMapping = {
            'Date': 'date',
            'Symbol': 'symbol',
            'Series': 'series',
            'Prev Close': 'prev_close',
            'Open': 'open',
            'High': 'high',
            'Low': 'low',
            'Last': 'last',
            'Close': 'close',
            'VWAP': 'vwap',
            'Volume': 'volume',
            'Turnover': 'turnover',
            'Trades': 'trades',
            'Deliverable': 'deliverable_volume',
            '%Deliverable': 'percent_deliverable'
        };

        const normalizeRow = (row) => {
            const normalizedRow = {};
            for (const key in row) {
                if (headerMapping[key]) {
                    normalizedRow[headerMapping[key]] = row[key];
                }
            }
            return normalizedRow;
        };

        // Validating the rows
        const validateRow = (row) => {
            const requiredFields = ['date', 'symbol', 'series', 'prev_close', 'open', 'high', 'low', 'last', 'close', 'vwap', 'volume', 'turnover', 'trades'];

            for (const field of requiredFields) {
                console.log(row)
                if (!row[field] || row[field] == null) {
                    return { valid: false, reason: `${field} is missing` };
                }
            }

            return { valid: true };
        };

        // Read and parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                totalRows++
                const normalizedRow = normalizeRow(row);
                const validation = validateRow(normalizedRow);

                if (validation.valid) {
                    results.push(normalizedRow);
                } else {
                    invalidRows.push({ row: normalizedRow, error: validation.reason });
                }
            })
            .on('end', () => {
                if (results.length > 0) {
                    StockData.insertMany(results)
                        .then(() => {
                            res.status(200).json({
                                message: 'CSV data saved successfully!',
                                totalRows: totalRows,
                                validEntries: results.length,
                                invalidEntries: invalidRows.length,
                                invalidRows,
                            });
                        })
                        .catch((err) => {
                            console.error('Database insertion error:', err);
                            return next(new AppError('Failed to save data to the database', 500));
                        });
                } else {
                    res.status(400).json({
                        message: 'No valid rows to upload',
                        invalidRows,
                    });
                }

                fs.unlinkSync(filePath);
            })
            .on('error', (err) => {
                console.error('File processing error:', err);
                return next(new AppError('Failed to process CSV file', 500));
            });

    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

// Function to get highest volume

const getHighestVolume = async (req, res, next) => {
    try {

        const { start_date, end_date, symbol } = req.query

        if (!symbol && (!start_date || !end_date)) {
            return next(new AppError("Query is required!", 400))
        }

        const condition = {}

        if (start_date && end_date) {
            condition.date = {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
        }

        if (symbol) {
            condition.symbol = symbol
        }

        const data = await StockData.find(condition).sort({ volume: -1 })

        if (data.length === 0) {
            return next(new AppError("No data found", 400))
        }

        res.status(200).json({
            success: true,
            message: "Highest volume",
            data: data[0].volume
        })

    } catch (err) {
        return next(new AppError(err, 500))
    }
}

// Function to get Close average

const getCloseAverage = async (req, res, next) => {
    try {
        const { start_date, end_date, symbol } = req.query

        if (!start_date || !end_date) {
            return next(new AppError("Start date and End Date is required!", 400))
        }

        if (!symbol) {
            return next(new AppError("Symbol is required!", 400))
        }


        const condition = {
            date: {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            },
            symbol: symbol
        }

        const data = await StockData.find(condition)

        let totalValue = 0

        data.map((data) => {
            totalValue = totalValue + data.close
        })

        let closeAverage = totalValue / data.length

        res.status(200).json({
            success: true,
            message: "Close average",
            data: closeAverage.toFixed(2)
        })

    } catch (err) {
        return next(new AppError(err.message, 500))
    }
}

// Function to get VWAP average

const getVWAPAverage = async (req, res, next) => {
    try {
        const { start_date, end_date, symbol } = req.query

        if (!symbol && (!start_date || !end_date)) {
            return next(new AppError("Query is required!", 400))
        }

        const condition = {}

        if (start_date && end_date) {
            condition.date = {
                $gte: new Date(start_date),
                $lte: new Date(end_date)
            }
        }

        if (symbol) {
            condition.symbol = symbol
        }

        const data = await StockData.find(condition)

        let totalValue = 0

        data.map((data) => {
            totalValue = totalValue + data.vwap
        })

        let vwapAverage = totalValue / data.length

        res.status(200).json({
            success: true,
            message: "VWAP average",
            data: vwapAverage.toFixed(2)
        })

    } catch (err) {
        return next(new AppError(err.message, 500))
    }
}

export { uploadData, getHighestVolume, getCloseAverage, getVWAPAverage };

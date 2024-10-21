import mongoose from "mongoose";

mongoose.set('strictQuery', false)

const dbConnection = async () => {
    try {
        console.log(process.env.MONGO_URI)
        const { connection } = await mongoose.connect(
            process.env.MONGO_URI
        )

        if (connection) {
            console.log(`Database is connected to ${connection?.host}`)
        }

    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

export default dbConnection
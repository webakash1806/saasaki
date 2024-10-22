import app from "./app.js"
import dbConnection from "./config/dbConfig.js"

const PORT = 5500 || process.env.PORT

app.listen(PORT, async () => {
    await dbConnection()
    console.log("App is running at:" + PORT)
})
import express from "express";
import 'dotenv/config'
import cors from "cors"
import connectDB from "./db/monogodb.js";
import userRoutes from "./routes/userRoutes.js"
import { app, server } from "./socket/index.js"

// const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRoutes)

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server is listening at ", PORT)
    })
})
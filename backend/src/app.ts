import express from "express"
import cors from "cors"
import postRouter from "./routes/post"

const app = express()

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(cors())

app.use("/api/posts", postRouter)

export { app }
import express from "express"
import cors from "cors"
import postRouter from "./routes/post"
import userRouter from "./routes/user"
import commentRouter from "./routes/comment"

const app = express()

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(cors())

app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)
app.use("/api/comments", commentRouter)

export { app }
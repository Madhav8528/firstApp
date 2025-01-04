import express, { json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import routes
import userRoutes from "./routes/user.routes.js"
import commentRoutes from "./routes/comment.route.js"
import likeRoutes from "./routes/like.route.js"

//declaration of routes
app.use("/api/v1/user", userRoutes)
app.use("api/v1/comment", commentRoutes)
app.use("api/v1/like", likeRoutes)

//export default app
//OR
export {app}
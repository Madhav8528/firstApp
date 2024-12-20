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

//declaration of routes
app.use("/api/v1", userRoutes)


//export default app
//OR
export {app}
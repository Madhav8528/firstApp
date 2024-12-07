import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express"

const app = express()
const dbConnection = async()=>{

try {
   const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
   console.log(`DATABASE CONNECTED WITH HOST : ${connectionInstance.connection.host}`);
   app.on('error', (error)=>{
    console.log("Error : ", error);
    throw error;
   })
   //already listening in index.js(start) src file
//    app.listen(process.env.PORT, ()=>{
//     console.log("App is listening on port : ", process.env.PORT);
//    })

} catch (error) {
    console.error("Error : ", error)
    process.exit(1)
}
}

export default dbConnection;
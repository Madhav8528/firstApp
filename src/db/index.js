import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express"

const app = express()
const dbConnection = async()=>{

try {
   const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
   const connectionHost = connectionInstance.connection.host
   console.log(`DATABASE CONNECTED WITH HOST : ${connectionHost}`);
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
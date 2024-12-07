//require('dotenv').config({path: './env'})
import dbConnection from './db/index.js';
import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
})
import express from "express"

const app = express()
dbConnection()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log("App is listening on port : ", process.env.PORT);
       })
})
.catch((error)=>{
    console.log(error);
    //throw error 
})






















/*
const app = express()

//iife function is used
;( async () => {
    try {
      await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      //listeners
      app.on("error",(error)=>{
        console.log("Error : ", error);
        throw error        
      })
      app.listen(process.env.PORT, ()=>{
        console.log("App is listening on port : ", process.env.PORT);
        
      })

    } catch (error) {
        console.error("Error : ", error);
        throw error
        
    }
})()
*/
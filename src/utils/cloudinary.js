import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


//const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dqes4jlnf',
  api_key: '189267991227771',
  api_secret: 'CSspXyANeW7nwiDmKPHYgBvJWZk',
  secure: true,
});

const cloudinaryUpload = async (localFilePath)=>{

    try {
        if(!localFilePath) return null;
        //uploading file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto",
        })
        //console.log(response);
        
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
    
}

export {cloudinaryUpload}
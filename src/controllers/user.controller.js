import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { cloudinaryUpload } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const registerUser = asyncHandler( async(req,res)=>{
   
    const {username, email, fullName, password} = req.body
    console.log("email ", email);
    
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    if(
        [username, email, fullName, password].some((field)=>{field?.trim()===""})
    ){
        throw new ApiError(400, "Please provide all the details")
    }

    const existedUser = User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(408, "User already existed")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar field is mandatory")
    }
    const avatar =  await cloudinaryUpload(avatarLocalPath)
    const coverImage = await cloudinaryUpload(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar field is mandatory")
    }
    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        username : username.toUpperCase(),
        email,
        password
    })
    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong!!, please try again")
    }
        
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!!")
    )



})

export {registerUser};
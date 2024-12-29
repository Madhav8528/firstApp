import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { cloudinaryUpload }  from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const generateAccessAndRefreshToken = async (userId) => {
    try { const user = User.findById(userId)
     const accessToken = generateAccessToken()
     const refreshToken = generateRefreshToken()

     user.refreshToken = refreshToken
     user.save({validateBeforeSave : false}) 

     return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Error while generating tokens")
    }
}

const registerUser = asyncHandler( async(req,res)=>{
   
    const {username, email, fullName, password} = req.body
    //console.log("email ", email);
    
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

    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(408, "User already existed")
    }

    const avatarLocalPath = await req.files?.avatar[0]?.path;
    //const coverImageLocalPath = await req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath =  req.files.coverImage[0].path
    }
   // console.log(req.files);
    
    //console.log(avatarLocalPath);
    //console.log(coverImageLocalPath);
    
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar field is mandatory")
    }
    const avatar = await cloudinaryUpload(avatarLocalPath)
    const coverImage = await cloudinaryUpload(coverImageLocalPath)
    // console.log(avatar);
    // console.log(coverImage);
    
    if(!avatar){
        throw new ApiError(401, "Avatarr field is mandatory")
    }
    const user = await User.create({
        fullName,
        avatar : avatar?.url,
        coverImage : coverImage?.url || "",
        username : username.toUpperCase(),
        email,
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong!!, please try again")
    }
        
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!!")
    )
})

const loginUser = asyncHandler( async (req, res) => {

    //get data = req.body
    //take email
    //find the user in db
    //check password
    //if right then send access and refresh token in cookie

    const {email, username, password} = req.body

    if(!email || !username){
        throw new ApiError(400, "Please enter email or username to login")
    }

   const user = await User.findOne({
        $or : [{email}, {username}]
    })

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.checkPassword(password)

    if(!isPasswordValid){
        throw new ApiError(402, "Password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = User.findById(user._id).select("-password -refreshToken")

    const options = {
        secure : true,
        httpOnly : true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(201, 
            {user : loggedInUser, accessToken, refreshToken},
            "User logged in Successfully"
        )
    )

})


const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {refreshToken : undefined}
        },
        {
            new : true
        }
    )
    const options = {
        secure : true,
        httpOnly : true
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(201, {}, "user logged out")
    )
})

export {registerUser, loginUser, logOutUser};
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js";

const healthCheck = asyncHandler(async (req, res) => {
   
    //simply a OK status response
    return res.status(200)
    .json( new ApiResponse(200, "OK", "Health Test Passed"))
})

export { healthCheck };
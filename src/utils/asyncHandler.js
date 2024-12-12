const asyncHandler = (handler) => {
    return (res, req, next) => {
        Promise.resolve(handler(res, req, next)).
        catch((err) => next(err))
    }
}

export {asyncHandler}

// const asyncHandler1 = (handler) => async(res, req, next) => {

//     try {
//         await handler(res, req, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             sucess :false,
//             message : err.message
//     })
//     }
// }
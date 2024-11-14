const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const {UserService}= require('../services')
function validateAuthRequest(req, res, next) {
    if (!req.body.email) {
        ErrorResponse.message = "something went wrong while authenticating user";

        ErrorResponse.error = new AppError(['email not found in this upcoming request'], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
    if (!req.body.password) {
        ErrorResponse.message = "something went wrong while authenticating password";

        ErrorResponse.error = new AppError(['password not found in this upcoming request'], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
    next();
}
async function checkAuth(req,res,next) {
    try {
        const resoponse = await UserService.isAuthenticated(req.header['x-access-token']);
        if (isAuthenticated) {
            req.user = resoponse;
            next();
        }
    } catch (error) {
        return res
            .status(error.statusCode)
            .json(error)
    }
}
module.exports = {
    validateAuthRequest,
    checkAuth
}
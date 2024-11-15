const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const {UserService}= require('../services');
const { message } = require('../utils/common/error-response');
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
        const resoponse = await UserService.isAuthenticated(req.headers['x-access-token']);
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

async function isAdmin(req,res,next) {
    const response = await UserService.isAdmin(req.user);
    if (!response) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'User not authorized for this action' });
    }
    next();
}

module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
}
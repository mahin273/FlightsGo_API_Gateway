const { StatusCodes } = require('http-status-codes');
const {UserService} = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');





/**
 * 
 * POST: /signup
 * req-body {email: 'm@gmail.com',Password:'123435'}
 */

async function createUser(req, res) {
    try {

        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
            .json(ErrorResponse);
    }
}

async function singin(req, res) {
    try {

        const user = await UserService.singin({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
            .json(ErrorResponse);
    }
}

async function addRoleToUser(req, res) {
    try {

        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
            .json(ErrorResponse);
    }
}


module.exports = {
    createUser,
    singin,
    addRoleToUser
}
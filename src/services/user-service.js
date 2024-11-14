const{StatusCodes}=require('http-status-codes')
const { UserRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error')
const{Auth} = require('../utils/common')

const userRepo = new UserRepository();

async function create(data) {
    try {
        const user = await userRepo.create(data);
        return user;

    } catch (error) {
        if (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });

            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }

        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function singin(data) {
    try {
        const user = await userRepo.getUserByEmail(data.email);
        if (!user) {
            throw new AppError('No user found for the given emai', StatusCodes.NOT_FOUND)
        }
        const passwordMatch = Auth.checkPassword(data.password, user.password);
        if (!passwordMatch) {
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST)
        }
        const jwt = Auth.createToken({ id: user.id, email: user.email });
        return jwt;
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error)
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR)
    }
    
}

async function isAuthenticated(token) {
    try {
        if (!toekn) {
            throw new AppError('Missing Jwt  Token', StatusCodes.BAD_REQUEST)  
        }
        const resoponse = Auth.verifyToken(token);
        const user = await userRepo.get(resoponse.id);
        if (!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND)
        }
        return user.id;
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST)
        }
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}






module.exports = {
    create,
    singin,
    isAuthenticated
}


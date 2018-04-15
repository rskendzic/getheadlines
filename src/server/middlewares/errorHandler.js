import logger from '../../config/logger';
import HTTP_ERRORS from '../utils/errors/errorsEnum';

/**
 * End request with a friendly JSON response,
 * including Error Stack Trace
 * @param {ApiError} err Instance of ApiError
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function developmentErrorHandler(err, req, res, next) {
	const statusCode = err.status || 500;
	logger.error(`error#${statusCode} 💀 "${err.message}":`, err.stack);

	res.status(statusCode).json({
		status: 'error',
		message: err.message || HTTP_ERRORS.internalServerError,
		stack: err.stack || err,
	}).end();
}

/**
 * End request with a friendly JSON response
 * @param {ApiError} err Instance of ApiError
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function productionErrorHandler(err, req, res, next) {
	const statusCode = err.status || 500;
	logger.error(`error#${statusCode} "${err.message}":`, err.stack);

	res.status(statusCode).json({
		status: 'error',
		message: err.message || HTTP_ERRORS.internalServerError,
	}).end();
}

export {
	developmentErrorHandler as dev,
	productionErrorHandler as prod,
};

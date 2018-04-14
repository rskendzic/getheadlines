import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
// import expressWinston from 'express-winston';
import helmet from 'helmet';
// Import passport from 'passport';

import { router } from '../server/routes';
// import logger from './logger';
import * as ErrorHandler from '../server/middlewares/errorHandler';
import { AppError } from '../server/utils/errors/appError';
import { ApiError } from '../server/utils/errors/apiError';

// Import User from '../server/models/user.model'

const app = express();
const env = process.env.NODE_ENV;

if (env === 'development') {
	app.use(morgan('dev'));
}

// Parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());

// App.use(passport.initialize());

// configure passport for Auth
// passport.use(User.createStrategy())
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

// secure apps by setting various HTTP headers
app.use(helmet());

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Enable detailed API logging in dev env
// if (env === 'development') {
// 	expressWinston.requestWhitelist.push('body');
// 	expressWinston.responseWhitelist.push('body');

// 	app.use(expressWinston.logger({
// 		winstonInstance: logger,
// 		meta: false, // Optional: log meta data about request (defaults to true)
// 		msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
// 		colorStatus: true,
// 	}));
// }

// Mount all routes on /api path
app.use('/api', router);

// If error is not an instanceOf ApiError or AppError, convert it.
app.use((err, req, res, next) => {
	if (!(err instanceof ApiError) && !(err instanceof AppError)) {
		const appError = new AppError(err.message, err.status);
		return next(appError);
	}

	return next(err);
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	const errorNotFound = new AppError('Not found', 404);
	return next(errorNotFound);
});

// Log error in winston transports, except when running tests
// if (env !== 'test') {
// 	app.use(expressWinston.errorLogger({
// 		winstonInstance: logger,
// 	}));
// }

// Development error handler - will print stacktrace
if (env === 'development') {
	app.use(ErrorHandler.dev);
}

// Production error handler
app.use(ErrorHandler.prod);

export default app;

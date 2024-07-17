const { createLogger, format, transports } = require('winston');
const { v4: uuidv4 } = require('uuid');

const customFormat = format.printf(({ level, message, timestamp, ...meta }) => {
    const localTimestamp = new Date(timestamp).toLocaleString(); // Convert timestamp to local date and time string
    return `${localTimestamp} [${level}] : ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
        customFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' })
    ]
});

const requestLogger = (req, res, next) => {
    const requestId = uuidv4(); // Generate a new request ID

    logger.info('Incoming request', {
        requestId,
        method: req.method,
        endpoint: req.originalUrl,
        headers: req.headers,
        body: req.body
    });

    const start = process.hrtime();
    res.on('finish', () => {
        const duration = process.hrtime(start);
        const timeInMs = duration[0] * 1e3 + duration[1] * 1e-6;

        logger.info('Outgoing response', {
            requestId,
            method: req.method,
            endpoint: req.originalUrl,
            status: res.statusCode,
            duration: `${timeInMs.toFixed(3)} ms`,
            response: res.locals.responseBody || ''
        });
    });

    next();
};

module.exports = { logger, requestLogger };

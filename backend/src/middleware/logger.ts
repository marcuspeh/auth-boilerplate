const { createLogger, format, transports } = require('winston');

const date = new Date();
date.setHours(0, 0, 0, 0);

function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

function formatDate(date: Date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({
            filename: `logs/error/${formatDate(date)}-error.log`,
            level: 'error',
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ],
    format: format.combine(
        format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        format.align(),
        format.printf((info: { level: any; timestamp: any; message: any; }) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )
})

export default logger;
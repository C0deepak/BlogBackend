class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = this.statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler
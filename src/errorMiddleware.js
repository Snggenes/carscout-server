const errorMiddleware = async (error, req, res, next) => {
    console.error(error);
    let errorMessage = "Internal server error";
    let statusCode = 500;
    if (error instanceof Error) {
        errorMessage = error.message;
        statusCode = error.statusCode || 500;
    }

    res.status(statusCode).json({ message: errorMessage });
};

module.exports = errorMiddleware;
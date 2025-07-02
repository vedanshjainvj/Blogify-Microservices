export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...data,
    });
};
export const sendError = (res, message = 'Internal Server Error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

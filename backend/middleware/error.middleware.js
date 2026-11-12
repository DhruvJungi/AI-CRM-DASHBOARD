import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
    next(new ApiError(404, `Route Not Found - ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Mongoose: bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid ID format',
        });
    }

    // mongoose: schema validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `a record with that ${field} already exists`;
    }

   // Mongoose: schema validation 
   if (err.name === "ValidationError") { 
    statusCode = 400; 
    message = Object.values(err.errors) 
    .map((e) => e.message) 
    .join(", ");  
   }

   if (process.env.NODE_ENV !== "production" && statusCode === 500) {
     console.error("*", err);
   }  
   
   res.status(statusCode).json ({ 
    success: false, 
    message,
    ... (process.env.NODE_ENV !== "production" && statusCode === 500
        ? { stack: err.stack } 
        : {}),
    });
};
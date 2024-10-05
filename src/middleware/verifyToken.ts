// src/middleware/verifyToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming 'Bearer token'
    
    if (!token) {
        res.status(403).json({ error: 'No token provided' });
        return; // End the function execution
    }

    jwt.verify(token, process.env.SECRET_KEY as string, (err) => {
        if (err) {
            res.status(401).json({ error: 'Unauthorized' });
            return; // End the function execution
        }
        next(); // Proceed to the next middleware or route handler
    });
};

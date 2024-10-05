// src/routes/auth.ts
import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { ParamsDictionary } from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import User from '../models/User'; // Adjust the path as necessary
import jwt from 'jsonwebtoken'; // Ensure this is imported

const router = express.Router();

interface LoginRequestBody {
    username: string;
    password: string;
}

interface RegisterRequestBody {
    username: string;
    password: string;
}

// Registration endpoint
router.post('/register', async (req: Request<unknown, unknown, RegisterRequestBody>, res: Response) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
router.post('/login', verifyToken, (req: Request<unknown, unknown, LoginRequestBody>, res: Response) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return bcrypt.compare(password, user.password).then((passwordMatch) => {
                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Invalid password' });
                }

                const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY as string, {
                    expiresIn: '1h',
                });

                res.json({ token });
            });
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

export default router;

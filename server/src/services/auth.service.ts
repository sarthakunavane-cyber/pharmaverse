import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const SECRET_KEY = process.env['JWT_SECRET'] || 'pharmaverse-secret-key-123';

export async function register(email: string, password: string, name: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        passwordHash,
        name,
        history: []
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: '24h' });
    return { token, user: { id: newUser._id, email: newUser.email, name: newUser.name } };
}

export async function login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    return { token, user: { id: user._id, email: user.email, name: user.name } };
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET_KEY) as { id: string, email: string };
    } catch (e) {
        return null;
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.verifyToken = verifyToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const SECRET_KEY = process.env['JWT_SECRET'] || 'pharmaverse-secret-key-123';
async function register(email, password, name) {
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const newUser = new User_1.User({
        email,
        passwordHash,
        name,
        history: []
    });
    await newUser.save();
    const token = jsonwebtoken_1.default.sign({ id: newUser._id, email: newUser.email }, SECRET_KEY, { expiresIn: '24h' });
    return { token, user: { id: newUser._id, email: newUser.email, name: newUser.name } };
}
async function login(email, password) {
    const user = await User_1.User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        throw new Error('Invalid email or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    return { token, user: { id: user._id, email: user.email, name: user.name } };
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    catch (e) {
        return null;
    }
}
//# sourceMappingURL=auth.service.js.map
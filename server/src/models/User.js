"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const HistorySchema = new mongoose_1.default.Schema({
    type: { type: String, required: true },
    data: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now }
});
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    history: [HistorySchema]
});
exports.User = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map
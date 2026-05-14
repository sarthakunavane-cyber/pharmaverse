"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FeedbackSchema = new mongoose_1.default.Schema({
    rating: { type: String, required: true },
    feature: { type: String, required: true },
    comments: { type: String },
    timestamp: { type: Date, default: Date.now }
});
exports.Feedback = mongoose_1.default.model('Feedback', FeedbackSchema);
//# sourceMappingURL=Feedback.js.map
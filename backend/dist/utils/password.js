"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtil = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordUtil {
    static SALT_ROUNDS = 10;
    static async hashPassword(password) {
        return await bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
    }
    static async comparePassword(password, hash) {
        return await bcryptjs_1.default.compare(password, hash);
    }
}
exports.PasswordUtil = PasswordUtil;

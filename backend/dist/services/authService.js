"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const userRepository_1 = require("../repositories/userRepository");
const studentRepository_1 = require("../repositories/studentRepository");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const enums_1 = require("../types/enums");
class AuthService {
    getUserRepository() {
        return new userRepository_1.UserRepository();
    }
    getStudentRepository() {
        return new studentRepository_1.StudentRepository();
    }
    async register(data) {
        const userRepo = this.getUserRepository();
        const studentRepo = this.getStudentRepository();
        const existingUser = await userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User with this email already exists.');
        }
        const passwordHash = await password_1.PasswordUtil.hashPassword(data.password);
        const user = await userRepo.createUser({
            email: data.email,
            fullName: data.fullName,
            department: data.branch,
            college: data.collegeName,
            passwordHash,
            role: enums_1.Role.STUDENT,
        });
        const studentProfile = await studentRepo.createProfile({
            userId: user.id || user.userId,
            email: data.email,
            fullName: data.fullName,
            collegeName: data.collegeName,
            branch: data.branch,
            yearOfStudy: data.yearOfStudy,
            degree: data.degree,
            location: data.location,
            careerGoal: data.careerGoal,
            bio: data.bio,
        });
        const token = jwt_1.JwtUtil.generateToken({
            id: String(user.id || user.userId),
            userId: String(user.id || user.userId),
            email: user.email,
            role: user.role || enums_1.Role.STUDENT,
            studentId: String(studentProfile.id || studentProfile.userId || user.id || user.userId),
        });
        return {
            user: {
                id: String(user.id || user.userId),
                email: user.email,
                role: user.role || enums_1.Role.STUDENT,
                studentProfile,
            },
            token,
        };
    }
    async login(data) {
        const userRepo = this.getUserRepository();
        const user = await userRepo.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid email or password credentials.');
        }
        const isMatch = await password_1.PasswordUtil.comparePassword(data.password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password credentials.');
        }
        const userId = String(user.id || user.userId);
        const token = jwt_1.JwtUtil.generateToken({
            id: userId,
            userId,
            email: user.email,
            role: user.role || enums_1.Role.STUDENT,
            studentId: String(user.student?.id || userId),
        });
        return {
            user: {
                id: userId,
                email: user.email,
                role: user.role || enums_1.Role.STUDENT,
                studentProfile: user.student || user,
            },
            token,
        };
    }
    async getMe(userId) {
        const userRepo = this.getUserRepository();
        const user = await userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;

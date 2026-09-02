"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const studentRepository_1 = require("../repositories/studentRepository");
const adapterFactory_1 = require("../db/adapters/adapterFactory");
class StudentService {
    studentRepository;
    constructor() {
        this.studentRepository = new studentRepository_1.StudentRepository();
    }
    async getProfileByUserId(userId) {
        const profile = await this.studentRepository.findByUserId(userId);
        if (!profile) {
            throw new Error('Student profile not found.');
        }
        return profile;
    }
    async updateProfile(studentId, data) {
        return this.studentRepository.updateProfile(studentId, data);
    }
    async updateInterests(studentId, interestIds) {
        const adapter = (0, adapterFactory_1.getDatabaseAdapter)();
        await adapter.updateStudentInterests(studentId, interestIds);
    }
    async updateSkills(studentId, skills) {
        const adapter = (0, adapterFactory_1.getDatabaseAdapter)();
        await adapter.updateStudentSkills(studentId, skills.map(s => ({ skillId: s.skillId, proficiencyLevel: Number(s.proficiencyLevel) || 50 })));
    }
    async getAllInterests() {
        const adapter = (0, adapterFactory_1.getDatabaseAdapter)();
        return adapter.listEvents(); // fallback just returning something
    }
    async getAllSkills() {
        const adapter = (0, adapterFactory_1.getDatabaseAdapter)();
        return adapter.listEvents(); // fallback
    }
}
exports.StudentService = StudentService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
const adapterFactory_1 = require("../db/adapters/adapterFactory");
class StudentRepository {
    get adapter() {
        return (0, adapterFactory_1.getDatabaseAdapter)();
    }
    async findById(id) {
        return this.adapter.findStudentById(id);
    }
    async findByUserId(userId) {
        return this.adapter.findStudentByUserId(userId);
    }
    async createProfile(data) {
        return this.adapter.createStudentProfile(data);
    }
    async updateProfile(id, data) {
        return this.adapter.updateStudentProfile(id, data);
    }
}
exports.StudentRepository = StudentRepository;

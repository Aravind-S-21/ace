"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const adapterFactory_1 = require("../db/adapters/adapterFactory");
class UserRepository {
    get adapter() {
        return (0, adapterFactory_1.getDatabaseAdapter)();
    }
    async findByEmail(email) {
        return this.adapter.findUserByEmail(email);
    }
    async findById(id) {
        return this.adapter.findUserById(id);
    }
    async createUser(data) {
        return this.adapter.createUser(data);
    }
}
exports.UserRepository = UserRepository;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarRepository = void 0;
const adapterFactory_1 = require("../db/adapters/adapterFactory");
class CalendarRepository {
    get adapter() {
        return (0, adapterFactory_1.getDatabaseAdapter)();
    }
    async addCalendarEvent(data) {
        return this.adapter.addCalendarEvent(data);
    }
    async getStudentCalendarEvents(studentId) {
        return this.adapter.getStudentCalendarEvents(studentId);
    }
    async removeCalendarEvent(id, studentId) {
        const res = await this.adapter.removeCalendarEvent(id);
        return res.success || !!res;
    }
}
exports.CalendarRepository = CalendarRepository;

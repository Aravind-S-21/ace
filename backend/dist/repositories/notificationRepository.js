"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const adapterFactory_1 = require("../db/adapters/adapterFactory");
class NotificationRepository {
    get adapter() {
        return (0, adapterFactory_1.getDatabaseAdapter)();
    }
    async getStudentNotifications(studentId, limit = 50) {
        return this.adapter.getStudentNotifications(studentId);
    }
    async createNotification(data) {
        return this.adapter.createNotification(data);
    }
    async markAsRead(id, studentId) {
        const res = await this.adapter.markNotificationAsRead(id);
        return res.success || !!res;
    }
}
exports.NotificationRepository = NotificationRepository;

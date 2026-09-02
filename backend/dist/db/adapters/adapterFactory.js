"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseAdapter = getDatabaseAdapter;
exports.setDatabaseAdapter = setDatabaseAdapter;
const prismaAdapter_1 = require("./prismaAdapter");
const inMemoryAdapter_1 = require("./inMemoryAdapter");
const env_1 = require("../../config/env");
let instance = null;
function getDatabaseAdapter() {
    if (!instance) {
        const mode = (process.env.DATABASE_ADAPTER || process.env.DB_MODE || env_1.env.DATABASE_ADAPTER).toLowerCase();
        if (mode === 'prisma') {
            try {
                instance = new prismaAdapter_1.PrismaDatabaseAdapter();
            }
            catch (err) {
                console.warn('Failed to initialize PrismaDatabaseAdapter, falling back to InMemoryDatabaseAdapter:', err);
                instance = new inMemoryAdapter_1.InMemoryDatabaseAdapter();
            }
        }
        else {
            instance = new inMemoryAdapter_1.InMemoryDatabaseAdapter();
        }
    }
    return instance;
}
function setDatabaseAdapter(adapter) {
    instance = adapter;
}

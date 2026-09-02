"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.ActionType = exports.Role = void 0;
var Role;
(function (Role) {
    Role["STUDENT"] = "STUDENT";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var ActionType;
(function (ActionType) {
    ActionType["VIEW"] = "VIEW";
    ActionType["CLICK"] = "CLICK";
    ActionType["SAVE"] = "SAVE";
    ActionType["REGISTER"] = "REGISTER";
    ActionType["SHARE"] = "SHARE";
    ActionType["DISMISS"] = "DISMISS";
    ActionType["SEARCH"] = "SEARCH";
    ActionType["CALENDAR_ADD"] = "CALENDAR_ADD";
})(ActionType || (exports.ActionType = ActionType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["DEADLINE"] = "DEADLINE";
    NotificationType["RECOMMENDATION"] = "RECOMMENDATION";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (exports.NotificationType = NotificationType = {}));

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserController = exports.getUserByIDController = exports.getUsersController = void 0;
const user_action_1 = require("../actions/user.action");
const getUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const data = yield (0, user_action_1.getUsersAction)(filters);
        res.status(200).json({
            message: 'Get users success',
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUsersController = getUsersController;
const getUserByIDController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = yield (0, user_action_1.getUserByIDAction)(id);
        res.status(200).json({
            message: 'Get user success',
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserByIDController = getUserByIDController;
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const params = req.body;
        const data = yield (0, user_action_1.updateUserAction)(id, Object.assign({}, params));
        res.status(200).json({
            message: 'Update user success',
            data,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateUserController = updateUserController;

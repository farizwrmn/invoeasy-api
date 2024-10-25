"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', user_controller_1.getUsersController);
router.get('/:id', user_controller_1.getUserByIDController);
router.patch('/:id', auth_middleware_1.verifyToken, user_controller_1.updateUserController);
exports.default = router;

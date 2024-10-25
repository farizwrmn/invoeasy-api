"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/register', auth_controller_1.registerController);
router.post('/login', auth_controller_1.loginController);
router.post('/verify', auth_middleware_1.verifyToken, auth_controller_1.verifyController);
router.get('/', auth_middleware_1.verifyToken, auth_controller_1.refreshTokenController);
router.post('/forgot-password', auth_controller_1.forgotPasswordController);
router.post('/reset-password', auth_middleware_1.verifyToken, auth_controller_1.resetPasswordController);
exports.default = router;

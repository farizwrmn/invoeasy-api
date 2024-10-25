"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', auth_middleware_1.verifyToken, product_controller_1.createProductController);
router.get('/:userId', product_controller_1.getProductsByUserIDController);
router.delete('/:id/soft-delete', product_controller_1.softDeleteProductAction);
router.get('/product/:id', product_controller_1.getProductByIDController);
router.put('/product/:id', product_controller_1.updateProductController);
exports.default = router;

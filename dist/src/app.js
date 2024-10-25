"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./config/index");
const path = require("path");
const cors_1 = __importDefault(require("cors"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const PORT = Number(index_1.API_PORT) || 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/public', express_1.default.static(path.join(__dirname, 'public')));
require('./routes')(app);
app.use('/protected', auth_middleware_1.authMiddleware, (req, res) => {
    res.send('This is a protected route.');
});
// scheduledInvoice();
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

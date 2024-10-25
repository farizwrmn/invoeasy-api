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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_json_1 = __importDefault(require("./data/users.json"));
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const prisma = new client_1.PrismaClient();
const ADMIN_EMAIL = 'admin@gmail.com';
const seedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('--- Start seeding users data ---');
    yield prisma.user.deleteMany();
    for (const user of users_json_1.default) {
        const salt = yield (0, bcrypt_1.genSalt)(10);
        const hashPassword = yield (0, bcrypt_1.hash)(user.password, salt);
        yield prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashPassword,
            },
        });
        console.log('Created user', user.name);
    }
    console.log('Seeding users data finished');
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield seedUsers();
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));

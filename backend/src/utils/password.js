import bcrypt from "bcryptjs";
export const hashPass = async (password) => {
    return await bcrypt.hash(password, 10);
};
export const comparePass = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};
//# sourceMappingURL=password.js.map
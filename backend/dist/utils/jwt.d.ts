import jwt from "jsonwebtoken";
interface JwtTokenPayload {
    userId: string;
    salonId?: string;
    role: string;
}
export declare const generateAccessToken: (payload: JwtTokenPayload) => string;
export declare const generateRefreshToken: (payload: JwtTokenPayload) => string;
export declare const verifyAccessToken: (token: string) => string | jwt.JwtPayload;
export declare const verifyRefreshToken: (token: string) => string | jwt.JwtPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map
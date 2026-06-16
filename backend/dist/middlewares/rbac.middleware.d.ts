import { type Request, type Response, type NextFunction } from "express";
export declare const requireRole: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=rbac.middleware.d.ts.map
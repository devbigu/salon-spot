import { type Request, type Response } from "express";
export declare const createService: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getServices: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getServiceById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateService: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateServiceStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteService: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=service.controller.d.ts.map
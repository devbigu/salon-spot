import { type Request, type Response } from "express";
export declare const createAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAppointments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAppointmentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAppointmentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAppointmentBasicDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAppointment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=appointment.controller.d.ts.map
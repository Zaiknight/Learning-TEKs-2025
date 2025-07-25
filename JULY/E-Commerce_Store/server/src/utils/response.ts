import { Response } from "express";

export class ResponseHandler {
  static success(res: Response, message: string, code: number, data: any = {}) {
    return res.status(code).json({
      code,
      status: "Success",
      message,
      data,
    });
  }

  static error(res: Response, message: string, code: number) {
    return res.status(code).json({
      code,
      status: `error`,
      message,
    });
  }

  static validationError(res: Response, errors: { path: any; message: string }[], code : number = 422) {
    return res.status(code).json({
      code: code,
      status: errors,
      message: errors.length > 0 ? errors[0].message : "Validation Error",
      validation_errors: errors
    });
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return res.status(401).json({
      code: 401,
      status: "error",
      message,
    });
  }
}
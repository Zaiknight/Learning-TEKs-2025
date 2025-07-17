// src/utils/response.ts

export class ResponseHandler {
    static success(res:any, message: string, data: any = {}) {
      return res.status(200).json({
        code: 200,
        status: "success",
        message,
        data,
      });
    }
  
    static error(res:any, message: string = "Something went wrong", code: number = 500) {
      return res.status(code).json({
        code,
        status: "error",
        message,
      });
    }
  
    static validationError(res:any, errors: any) {
      return res.status(422).json({
        code: 422,
        status: "error",
        message: "Validation Failed",
        validation_errors: errors,
      });
    }
  
    static unauthorized(res:any, message = "Unauthorized") {
      return res.status(401).json({
        code: 401,
        status: "error",
        message,
      });
    }
  }
  
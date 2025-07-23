// src/utils/response.ts

export class ResponseHandler {
    static success(res:any, message: string, code: number, data: any = {}) {
      return res.status(code).json({
        code,
        status: "success",
        message,
        data,
      });
    }
  
    static error(res: any, message: string, code: number) {
      return res.status(code).json({
        code,
        status: `Error: ${code}`,
        message:  message,
      });
    }
    
    // static BadRequestError(res:any, code: number = 400) {
    //   return res.status(code).json({
    //     code:400,
    //     status: "error",
    //     message:  "The server could not understand the request. Maybe a bad syntax?",
    //   });
    // }

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
  
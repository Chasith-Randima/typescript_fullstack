declare module 'express-serve-static-core' {
    interface Request {
    
      user?:any;
    //   secure?:string;
    }
    // interface Response {
    //   myField?: string,
    // }
  }


// // declare namespace Express {
// //     interface Request {
// //         user?:any;
// //     }
// // }
// // declare namespace Express {
// //     export interface Request {
// //        tenant?: string
// //     }
// //  }
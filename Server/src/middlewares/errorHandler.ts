"use strict"

import { Request,Response,NextFunction } from "express";
const errorHandler = (err:any,req:Request,res:Response,next:NextFunction):Object =>{

    return res.status(500).json({err})
}

export default errorHandler
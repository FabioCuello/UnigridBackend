import { RequestHandler, Request, Response, NextFunction } from "express"

export const catchAsync = (handler: RequestHandler) => {
    return (...args: [Request, Response, NextFunction]) => handler(...args).catch(args[2])
}

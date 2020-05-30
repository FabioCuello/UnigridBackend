import { Request, Response, NextFunction } from "express"

export const messageVerification = (req: Request, res: Response, next: NextFunction) => {
    if (!!req.session!.message) return next()

    res.redirect("/")
}
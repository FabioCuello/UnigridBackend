import { Request, Response, NextFunction } from "express"

export const resetPasswordVerification = (req: Request, res: Response, next: NextFunction) => {
    if (!!req.session!.data) return next()

    res.redirect("/")
}
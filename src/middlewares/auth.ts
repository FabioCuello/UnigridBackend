import { Request, Response, NextFunction } from "express"
import { islogIn } from "../lib/login"

export const RequireNotAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!islogIn(req)) return next()

    res.redirect("/")
}

export const RequireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (islogIn(req)) return next()

    res.redirect("/login")
}
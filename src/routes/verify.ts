import { Router, Request, Response } from "express"
import { User } from "../models/user"
import { catchAsync } from "../middlewares"

const router = Router()

router.get("/email/verify", catchAsync(async (req: Request, res: Response) => {
    const { id } = req.query

    const user = await User.findById(id).select("verifiedAt")

    res.locals = { active: ["", "", ""] }

    if (!user || !User.hasValidVerificationUrl(req.originalUrl, req.query)) {
        return res.render("pages/message", { message: "Invalid activation link" })
    }

    if (user.verifiedAt) {
        return res.render("pages/message", { message: "Email already verified " })
    }

    await user.markAsVerified(user)
    res.render("pages/message", { message: `You have successfully completed your registration` })
}))

export { router as verify }
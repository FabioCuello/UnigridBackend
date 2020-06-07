import { Router, Request, Response } from "express"
import { User } from "../models/user"
import { catchAsync } from "../middlewares"
import { sendEmail } from "../lib"

const router = Router()

router.get("/email/verify", catchAsync(async (req: Request, res: Response) => {
    const { id } = req.query

    const user = await User.findById(id).select("verifiedAt data.email data.firstName data.lastName")

    res.locals = { active: ["", "", ""] }

    if (!user || !User.hasValidVerificationUrl(req.originalUrl, req.query)) {
        return res.render("pages/message", { message: "Invalid activation link" })
    }

    if (user.verifiedAt) {
        return res.render("pages/message", { message: "Email already verified " })
    }

    await Promise.all([
        user.markAsVerified(user),
        sendEmail("Register complited", [user.data.email], `Congratulations ${user.data.firstName} ${user.data.lastName}, you have successfully registered on the UniGRID network.`)
    ])
    res.render("pages/message", { message: `You have successfully completed your registration` })
}))

export { router as verify }
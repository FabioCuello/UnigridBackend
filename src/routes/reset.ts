import { Router, Response, Request } from "express"
import { forgotPasswordSchema, newPassword } from "../validation/auth"
import { sendEmail } from "../lib"
import { User, PasswordReset } from "../models"
import { resetPasswordVerification, RequireNotAuth, catchAsync } from "../middlewares"

const router = Router()

router.get("/password/email", RequireNotAuth, (req: Request, res: Response) => {
    res.render("pages/reset", { active: ["", "", "active"] })
})

router.post("/password/email", RequireNotAuth, async (req: Request, res: Response) => {
    const validation = await forgotPasswordSchema.validate(req.body, { abortEarly: false })

    if (validation.error) return res.send({ success: false, message: validation.error.details[0].message })

    const { email } = req.body
    const user = await User.findOne({ "data.email": email })

    if (user) {
        const token = PasswordReset.plaintextToken()
        const reset = await PasswordReset.create({ userId: user.id, token })
        const link = reset.url(token)

        await sendEmail("Reset your password", [email], `Reset your password with this link: ${link}`)
    }

    req.session!.message = "If you have an account with us, you will receive an email with a link to reset your password"
    res.send({ success: true })
})

router.get("/password/reset", RequireNotAuth, catchAsync(async (req: Request, res: Response) => {
    const { id, token } = req.query

    const reset = await PasswordReset.findById(id)

    res.locals = { active: ["", "", ""] }

    if (!reset || !reset.isValid(token) || !(await User.findById(reset.userId))) {
        return res.render("pages/message", { message: "Invalid password reset token" })
    }

    req.session!.data = reset

    res.render("pages/passreset")
}))

router.post("/password/reset", [RequireNotAuth, resetPasswordVerification], catchAsync(async (req: Request, res: Response) => {
    const validation = await newPassword.validate(req.body, { abortEarly: false })
    if (validation.error) return res.send({ success: false, message: validation.error.details[0].message })

    const { password } = req.body
    const { data: { userId } } = req.session!
    delete req.session!.data

    const user = await User.findById(userId)

    await Promise.all([
        User.resetPassword(user!, password),
        PasswordReset.deleteMany({ userId })
    ])

    req.session!.message = "Password has been successfully changed"
    res.send({ success: true })
}))

export { router as reset }
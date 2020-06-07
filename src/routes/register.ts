import { Router, Request, Response } from "express"
import { RequireNotAuth, catchAsync } from "../middlewares"
import { sendEmail } from "../lib"
import { User } from "../models/user"
import { registerSchema } from "../validation/auth"

const router = Router()

router.get("/register", RequireNotAuth, (req: Request, res: Response) => {
    res.render("pages/register", { active: ["", "active", ""] })
})

router.post("/register", RequireNotAuth, catchAsync(async (req: Request, res: Response) => {
    const validation = await registerSchema.validate(req.body, { abortEarly: false })

    if (validation.error) return res.send({ success: false, message: validation.error.details[0].message })

    const { firstName, lastName, email, password } = req.body
    const alerts = req.body.alerts == "true" ? true : false
    const newsletter = req.body.newsletter == "true" ? true : false

    const found = await User.exists({ "data.email": email })

    if (found) return res.send({ success: false, message: "Email is already taken" })

    const newUser = await User.create({
        data: {
            firstName,
            lastName,
            email,
            password,
        },
        subcriptions: {
            alerts,
            newsletter
        }
    })

    const link = newUser.verificationUrl()

    await sendEmail("Subscription", email, `Complete your register with this link: ${link}`)

    req.session!.message = `An email has been send to ${email}. Complete your registration to continue`

    res.send({ success: true })
}))

export { router as register }
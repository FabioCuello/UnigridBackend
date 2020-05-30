import { Router, Request, Response } from "express"
import { RequireNotAuth, RequireAuth, catchAsync } from "../middlewares"
import { logIn } from "../lib/login"
import { User } from "../models/user"
import { SESSION_NAME } from "../config/sessions"

const router = Router()

router.get("/login", RequireNotAuth, (req: Request, res: Response) => {
    res.render("pages/login", { active: ["", "", "active"] })
})

router.post("/login", RequireNotAuth, catchAsync(async (req: Request, res: Response) => {
    const user = await User.findOne({ "data.email": req.body.email })

    if (!user || !await user.comparePassword(req.body.password)) {
        return res.send({ success: false, message: "Invalid email or password " })
    }

    if (!user.verifiedAt) return res.send({ success: false, message: "Please complete your registration to loging" })

    logIn(req, user._id)

    res.send({ success: true })
}))

router.get("/logout", RequireAuth, (req: Request, res: Response) => {
    req.session!.destroy(err => {
        if (err) {
            return res.redirect("/home")
        } else {
            res.clearCookie(`${SESSION_NAME}`)
            res.redirect("/")
        }
    })
})

export { router as login }
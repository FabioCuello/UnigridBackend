import { Router, Request, Response } from "express"
import { User, adminRequest } from "../models"
import { sendEmail } from "../lib"
import { ADMIN_EMAIL } from "../config"
import { catchAsync, RequireAuth } from "../middlewares"

const router = Router()

router.get("/config", RequireAuth, async (req: Request, res: Response) => {
    const user = await User.findById(req.session!.userId)

    if (!user) return res.redirect("/logout")

    res.render("pages/user", {
        active: ["", "", "active"],
        firstname: user.data.firstName,
        lastname: user.data.lastName,
        email: user.data.email,
        alert: user.subcriptions.alerts,
        newsletter: user.subcriptions.newsletter,
        moderator: user.admin
    })
})

router.get("/config/user/request/admin/verify", catchAsync(async (req: Request, res: Response) => {
    const { id, token } = req.query

    res.locals = { active: ["", "", ""] }

    const newAdminRequest = await adminRequest.findById(id)
    const user = await User.findById(newAdminRequest!.userId)

    if (!newAdminRequest || !newAdminRequest.isValid(token) || !user) {
        return res.render("pages/message", { message: "Invalid activation link" })
    }

    if (user.admin) {
        return res.render("pages/message", { message: `User with email: ${user.data.email} is already an administrator` })
    }

    user.admin = true
    await user.save()

    res.render("pages/message", { message: `User with email: ${user.data.email} is now administrator` })
}))

router.post("/config/user/request/admin", RequireAuth, catchAsync(async (req: Request, res: Response) => {
    const user = await User.findById(req.session!.userId)

    if (await adminRequest.findOne({ userId: user!.id })) {
        return res.send({ message: "Your request was already sent to the administrator" })
    }

    const token = adminRequest.plaintextToken()
    const newAdminRequest = await adminRequest.create({
        userId: user!.id,
        token
    })
    const link = newAdminRequest.url(token)

    const output = `<h3> The user ${user!.data.firstName} ${user!.data.lastName} request to be an administrator</h3> 
    <h2> <strong> You can enable this request </strong> throught the following link <strong>or ignore the request</strong>: ${link}</h2>`


    await sendEmail("Administrator request", [`${ADMIN_EMAIL}`], output)

    res.send({ message: "An email has been sent to the administrator" })
}))

router.patch("/config/user/set", RequireAuth, async (req, res) => {
    try {
        const alert = req.body.alert == "true" ? true : false
        const newsletter = req.body.newsletter == "true" ? true : false

        const user = await User.findById(req.session!.userId)

        user!.subcriptions.alerts = alert
        user!.subcriptions.newsletter = newsletter
        await user!.save()

        res.json({
            sucess: true,
            message: "Changes have been successfully saved"
        })
    } catch (err) {
        res.json({
            sucess: false,
            message: "Opsss, try again..."
        })
    }
})

export { router as config }
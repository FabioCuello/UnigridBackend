import { Router, Request, Response } from "express"
import { RequireNotAuth, messageVerification } from "../middlewares"

const router = Router()

router.get("/message", [RequireNotAuth, messageVerification], (req: Request, res: Response) => {
    const { message } = req.session!
    delete req.session!.message

    res.render("pages/message", { message, active: ["", "", ""] })
})

export { router as message }
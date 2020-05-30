import { Router, Request, Response } from "express"
import { RequireAuth } from "../middlewares/auth"
import { User } from "../models/user"

const router = Router()

router.get("/", RequireAuth, async (req: Request, res: Response) => {
    const user = await User.findById(req.session!.userId)

    res.render("pages/main", { active: ["", "", ""], main: true, admin: user!.admin })
})

export { router as main }
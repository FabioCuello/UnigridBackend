import express, { Request, Response, NextFunction } from "express"
import session from "express-session"
import cors from "cors"
import bodyParser from "body-parser"
import { SESSION_OPTIONS } from "./config/index"
import { main, login, register, config, verify, message, reset } from "./routes"


export const createApp = () => {
    const app = express()

    app.use(cors())

    app.use(express.static(__dirname + "/../src/public"))

    app.set("views", __dirname + "/../src/views")

    app.set("view engine", "ejs")

    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(express.json())

    app.use(session(SESSION_OPTIONS))

    app.use((req, res, next) => {
        const { userId } = req.session!
        app.locals.userId = userId
        next()
    })

    app.use(login)

    app.use(register)

    app.use(main)

    app.use(config)

    app.use(verify)

    app.use(message)

    app.use(reset)

    app.use((req, res, next) => {
        res.locals = { active: ["", "", ""] }
        res.status(404)
        res.render("pages/message", { message: "404 Page not found :c" })
    })

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.locals = { active: ["", "", ""] }
        console.error(err.stack);
        res.render("pages/message", { message: "Something broke!, Try again later" })
    });

    return app
}

import { SessionOptions } from "express-session"

const ONE_HOUR = 1000 * 60 * 60

const THIRTY_MINUTES = ONE_HOUR / 2

export const {
    SESSION_SECRET,
    SESSION_NAME
} = process.env

export const SESSION_OPTIONS: SessionOptions = {
    secret: SESSION_SECRET!,
    name: SESSION_NAME,
    cookie: {
        maxAge: THIRTY_MINUTES,
        sameSite: true
    },
    resave: false,
    saveUninitialized: false
}
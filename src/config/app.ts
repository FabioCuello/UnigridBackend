export const {
    NODE_ENV = "development",
    APP_PORT,
    APP_HOSTNAME,
    APP_PROTOCOL = "http",
    ADMIN_EMAIL,
    APP_SECRET
} = process.env

export const APP_ORIGIN = `${APP_PROTOCOL}://${APP_HOSTNAME}:${APP_PORT}`

export const IN_PROD = NODE_ENV === "production"
import Joi from "@hapi/joi"

const firstName = Joi.string().min(3).max(128).trim().required()
const lastName = Joi.string().min(3).max(128).trim().required()
const email = Joi.string().email().min(8).max(254).lowercase().trim().required()
const password = Joi.string().min(8).max(128).required()
const re_pass = Joi.valid(Joi.ref("password")).required()
const alerts = Joi.string()
const newsletter = Joi.string()

export const registerSchema = Joi.object({
    firstName,
    lastName,
    email,
    password,
    re_pass,
    alerts,
    newsletter,
})

export const forgotPasswordSchema = Joi.object({
    email
})

export const newPassword = Joi.object({
    password,
    re_pass
})
import { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs"
import { createHash, createHmac, timingSafeEqual } from "crypto"
import { BCRYPT_WORK_FACTOR, EMAIL_VERIFICATION_TIMEOUT, APP_ORIGIN, APP_SECRET } from "../config/index"
import { userDocument, UserModel } from "./interfaces"

const infoSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
})
const subscriptionSchema = new Schema({
    alerts: Boolean,
    newsletter: Boolean
})
const userSchema = new Schema({
    data: infoSchema,
    subcriptions: subscriptionSchema,
    admin: { type: Boolean, default: false },
    verifiedAt: Date
})

userSchema.pre<userDocument>("save", async function () {
    if (this.isModified("data.password")) {
        return this.data.password = await hash(this.data.password, BCRYPT_WORK_FACTOR)
    }
})

userSchema.methods.comparePassword = function (pass: string) {
    return compare(pass, this.data.password);
}

userSchema.methods.verificationUrl = function () {
    const token = createHash("sha1").update(this.data.email).digest("hex")

    const expires = Date.now() + EMAIL_VERIFICATION_TIMEOUT

    const url = `${APP_ORIGIN}/email/verify?id=${this.id}&token=${token}&expires=${expires}`
    const signature = User.signVerificationUrl(url)

    return `${url}&signature=${signature}`
}

userSchema.methods.verificationAdmin = function () {
    const token = createHash("sha1").update(this.data.email).digest("hex")
    const url = `${APP_ORIGIN}/user/config/request/admin/verify?id=${this.id}&token=${token}`
    const signature = User.signVerificationUrl(url)

    return `${url}&signature=${signature}`
}

userSchema.methods.markAsVerified = async (user: userDocument): Promise<boolean> => {
    user.verifiedAt = new Date()

    if (await user.save()) return true

    return false
}

userSchema.statics.signVerificationUrl = (url: string) => createHmac("sha256", APP_SECRET!).update(url).digest("hex")

userSchema.statics.hasValidVerificationUrl = (path: string, query: any) => {
    const url = `${APP_ORIGIN}${path}`
    const original = url.slice(0, url.lastIndexOf('&'))
    const signature = User.signVerificationUrl(original)

    return timingSafeEqual(Buffer.from(signature), Buffer.from(query.signature)) && +query.expires > Date.now()
}

userSchema.statics.hasValidVerificationUrlAdmin = (path: string, query: any) => {
    const url = `${APP_ORIGIN}${path}`
    const original = url.slice(0, url.lastIndexOf('&'))
    const signature = User.signVerificationUrl(original)

    return timingSafeEqual(Buffer.from(signature), Buffer.from(query.signature))
}

userSchema.statics.resetPassword = async (user: userDocument, password: string) => {
    user.data.password = password
    await user.save()
}

export const User = model<userDocument, UserModel>("User", userSchema)
import { Schema, model } from "mongoose"
import { PASSWORD_RESET_TIMEOUT, APP_ORIGIN, APP_SECRET, PASSWORD_RESET_BYTES } from "../config/index"
import { randomBytes, createHmac, timingSafeEqual } from "crypto"
import { PasswordResetDocument, PasswordResetModel } from "./interfaces"

const passwordResetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    token: String,
    expiredAt: Date
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
})

passwordResetSchema.pre<PasswordResetDocument>("save", function () {
    if (this.isModified("token")) {
        this.token = PasswordReset.hashedToken(this.token)
    }

    if (!this.expiredAt) {
        this.expiredAt = new Date(new Date().getTime() + PASSWORD_RESET_TIMEOUT)
    }
})

passwordResetSchema.methods.url = function (plaintextToken: string) {
    return `${APP_ORIGIN}/password/reset?id=${this.id}&token=${plaintextToken}`
}

passwordResetSchema.methods.isValid = function (plaintextToken: string) {
    const hash = PasswordReset.hashedToken(plaintextToken)

    return timingSafeEqual(Buffer.from(hash), Buffer.from(this.token)) && this.expiredAt > new Date()
}

passwordResetSchema.statics.hashedToken = (plaintextToken: string) => {
    return createHmac("sha256", APP_SECRET!).update(plaintextToken).digest("hex")
}

passwordResetSchema.statics.plaintextToken = () => {
    return randomBytes(PASSWORD_RESET_BYTES).toString("hex")
}

export const PasswordReset = model<PasswordResetDocument, PasswordResetModel>("PasswordReset", passwordResetSchema)
import { Schema, model } from "mongoose"
import { PASSWORD_RESET_TIMEOUT, APP_ORIGIN, APP_SECRET, PASSWORD_RESET_BYTES } from "../config/index"
import { randomBytes, createHmac, timingSafeEqual } from "crypto"
import { PasswordResetDocument as requestAdminDocument, PasswordResetModel as requestAdminModel } from "./interfaces"

const adminRequestSchema = new Schema({
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

adminRequestSchema.pre<requestAdminDocument>("save", function () {
    if (this.isModified("token")) {
        this.token = adminRequest.hashedToken(this.token)
    }
})

adminRequestSchema.methods.url = function (plaintextToken: string) {
    return `${APP_ORIGIN}/config/user/request/admin/verify?id=${this.id}&token=${plaintextToken}`
}

adminRequestSchema.methods.isValid = function (plaintextToken: string) {
    const hash = adminRequest.hashedToken(plaintextToken)

    return timingSafeEqual(Buffer.from(hash), Buffer.from(this.token))
}

adminRequestSchema.statics.hashedToken = (plaintextToken: string) => {
    return createHmac("sha256", APP_SECRET!).update(plaintextToken).digest("hex")
}

adminRequestSchema.statics.plaintextToken = () => {
    return randomBytes(PASSWORD_RESET_BYTES).toString("hex")
}

export const adminRequest = model<requestAdminDocument, requestAdminModel>("adminRequest", adminRequestSchema)
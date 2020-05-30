import { Document, Model } from "mongoose"

export interface PasswordResetDocument extends Document {
    userId: string
    token: string
    expiredAt: Date
    url: (plaintextToken: string) => string
    isValid: (plaintextToken: any) => boolean
}

export interface PasswordResetModel extends Model<PasswordResetDocument> {
    plaintextToken: () => string
    hashedToken: (plaintextToken: string) => string
}
import { Document, Model } from "mongoose"

interface infoDocument extends Document {
    firstName: string
    lastName: string
    email: string
    password: string
}
interface subcriptionsDocument extends Document {
    alerts: boolean
    newsletter: boolean
}
export interface userDocument extends Document {
    data: infoDocument
    subcriptions: subcriptionsDocument
    admin: boolean
    verifiedAt: Date
    comparePassword: (pass: string) => Promise<boolean>
    verificationUrl: () => string
    verificationAdmin: () => string
    markAsVerified: (user: userDocument) => Promise<boolean>
}

export interface UserModel extends Model<userDocument> {
    signVerificationUrl: (url: string) => string
    hasValidVerificationUrl: (path: string, query: any) => boolean
    hasValidVerificationUrlAdmin: (path: string, query: any) => boolean
    resetPassword: (user: userDocument, password: string) => void
}
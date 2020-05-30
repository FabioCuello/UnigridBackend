import { SMTP_OPTIONS, MAIL_FROM } from "../config/index"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport(SMTP_OPTIONS)

export const sendEmail = async (subject: string, receivers: string[], output: string, attachments?: Array<object>, text: string = ""): Promise<void> => {
    if (receivers.length == 0) return

    const MAILOPTIONS = {
        from: MAIL_FROM, // sender address
        to: `${receivers}`, // list of receivers
        subject: `${subject}`, // Subject line
        text, // plain text body
        html: output, // html body
        attachments
    }

    return await transporter.sendMail(MAILOPTIONS, err => { if (err) throw err })
}

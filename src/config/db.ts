import { ConnectionOptions } from "mongoose"

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOST,
    MONGO_DATABASE
} = process.env

export const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${(MONGO_PASSWORD)}@${MONGO_HOST}/${MONGO_DATABASE}`

export const MONGO_OPTIONS: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
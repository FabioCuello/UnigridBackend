require("dotenv").config()

import { createApp } from "./app"
import mongoose from "mongoose"
import { MONGO_OPTIONS, MONGO_URL, APP_PORT, APP_ORIGIN } from "./config/index"

    ; (async () => {
        await mongoose.connect(MONGO_URL, MONGO_OPTIONS)

        mongoose.set("useCreateIndex", true);

        const app = createApp()

        app.listen(APP_PORT, () => console.log(`${APP_ORIGIN}`))

    })()

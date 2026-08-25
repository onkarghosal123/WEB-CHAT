import arcjet, { fixedWindow } from "@arcjet/node";
import { ENV } from "./env.js";
const aj = arcjet({
    key: ENV.ARCJET_KEY,
    rules: [
        fixedWindow({
            mode: "LIVE",
            window: "5m",
            max: 5
        })
    ]
});
export default aj;
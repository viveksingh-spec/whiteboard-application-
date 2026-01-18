import express from "express"
import refreshAccesstoken from "../controller/RefreshController.js"
const refreshrouter = express.Router()


refreshrouter.post('/refresh',refreshAccesstoken);

export {refreshrouter}
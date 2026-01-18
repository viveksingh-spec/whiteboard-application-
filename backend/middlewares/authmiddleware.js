import jwt from "jsonwebtoken"
import {errorResponse} from "../utils/responce.js"

const verify = async(req,res,next)=>{
       try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        if(!token){
            return errorResponse(res,401,"Token is missing")
        }
        const decoded = jwt.verify(token,process.env.ACCESSTOKENSECRET);
        req.userId = decoded.id
        next()
       } catch (error) {
        return errorResponse(res,401,"Invalid or expired token")
       }
}
export {verify}
import User from "../models/usermodel.js";
import { errorResponse, successResponse } from "../utils/responce.js";


const Register = async(req,res)=>{
      try {
        const {username,email,password} = req.body
        if(!username || !email || !password){
              return errorResponse(res,401,"missing Credidential")
        }
        const isexist = await User.findOne({email})
        if(isexist){
              return errorResponse(res,400,"user already exist with email")
        }
  
        const user = new User({
             username,
             email,
             password
        })
        
        await user.save()
        return successResponse(res,200,"user registered successfully",{username,email})

      } catch (error) {
        console.log(error)
        return errorResponse(res,500,"something went wrong on server side!!!",error)
      }
}


const Login = async(req,res)=>{
      try {
      
         const {email,password} = req.body 
         if(!email || !password){
              return errorResponse(res,401,"missing Credidential")
        }
        const user = await User.findOne({email})
        if(!user){
              return errorResponse(res,400,"user is not exist with this email")
        }
        const checkpass = await user.comparepassword(password)
        if(!checkpass){
            return errorResponse(res,400,"Password not matched")
        }

        const access_token = await user.GenerateAccessToken()
        const refresh_token = await user.GenerateRefreshToken()

        res.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        successResponse(res,200,"Logged in !!",{access_token:access_token})
      } catch (error) {
          return error(rws,500,"something went wrong!!")
      }
}


export {
    Register,
    Login
}
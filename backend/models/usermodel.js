import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const UserSchema = new mongoose.Schema({
     username:{
          type:String,
          required:true,
          trim:true
     },
     email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate:{
            validator:validator.isEmail,
            message:"Please enter valide email"
        }
     },
     password:{
        type:String,
        required:true,
        trim:true,
        validate:{
            validator:(value)=>
            validator.isStrongPassword(value,
                {
                    minLength:8,
                    minUppercase:1,
                    minLowercase:1,
                    minNumbers:1,
                    minSymbols:1
                }
            ),
        message:"Password must contain min of 8 length ,one uppercase,one lowercase and an special charecter!"
        }
     },
     refreshToken:{
         type:String,
     }
},{timestamps:true})



UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); 
});

UserSchema.methods.comparepassword = async function(password){
      return  await bcrypt.compare(password,this.password)
}

UserSchema.methods.GenerateAccessToken = function(){
        const access = jwt.sign(
            {
                id:this._id,        // this is correct or .id correct 
                email:this.email
            },
            process.env.ACCESSTOKENSECRET,
            {expiresIn:process.env.ACCESSTOKENTIME}
        )
        return access;
}

UserSchema.methods.GenerateRefreshToken = function(){
        const refresh = jwt.sign(
            {
                id:this._id,
                email:this.email
            },
            process.env.REFRESHTOKENSECRET,
            {expiresIn:process.env.REFRESHTOKENTIME}
        )
        return refresh;
}


const User = mongoose.model("user",UserSchema);

export default User;
import  express  from "express";
import { Register,Login } from "../controller/authcontroler.js";


const authrouter = express.Router()
authrouter.post('/register',Register)
authrouter.post('/login',Login)


export {authrouter}
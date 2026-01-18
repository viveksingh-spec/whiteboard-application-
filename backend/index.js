import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ConnectDB } from "./db.js"
import { authrouter } from "./routers/userrouter.js"
import { canvasrouter } from "./routers/canvasrouter.js"
import { refreshrouter } from "./routers/refreshrouter.js"
dotenv.config()



const app = express()
ConnectDB()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/user',authrouter)
app.use('/user',refreshrouter)
app.use('/canvas',canvasrouter)
const PORT = process.env.PORT||5050

app.get('/',(req,res)=>{
  return res.send("app is running")
})

app.listen(PORT,()=>{
      console.log("app is running on port 5050")
})
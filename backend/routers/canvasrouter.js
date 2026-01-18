import express from "express"
import { getallcanvas,getcanvas,DeleteCanvas,CreateCanvas,UpdateCanvas } from "../controller/canvascontroller.js"
import { verify } from "../middlewares/authmiddleware.js"
const canvasrouter = express.Router()

canvasrouter.get('/getall',verify,getallcanvas);
canvasrouter.get('/get/:id',verify,getcanvas);
canvasrouter.post('/create',verify,CreateCanvas);
canvasrouter.put('/update',verify,UpdateCanvas);
canvasrouter.delete('/delete/:id',verify,DeleteCanvas);

export {canvasrouter}


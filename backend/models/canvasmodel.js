import mongoose from "mongoose";

const canvasSchema = new mongoose.Schema({
       owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
       },
       elements:{
        type:[mongoose.Schema.Types.Mixed],
        default:[]
       }
},{timestamps:true})

const Canvas = mongoose.model("Canvas",canvasSchema);

export {Canvas}
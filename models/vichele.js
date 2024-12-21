import mongoose from "mongoose";


const vicheleSchema = new mongoose.Schema({
    name:String,
    seat:Number,
},{timestamps:true})



export const Vichele = mongoose.model("Vichele",vicheleSchema);
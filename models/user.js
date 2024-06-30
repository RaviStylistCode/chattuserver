import mongoose, { mongo }  from "mongoose";


const userSchema=new mongoose.Schema({

    name:{
        type:String,
        trim:true,
        required:[true,"please enter your name"],
        minLength:[4,"Name must be 4 character long"]
    },

    email:{
        type:String,
        trim:true,
        unique:[true,"please enter a unique email"],
        required:[true,"please enter your email"]
    },

    password:{
        type:String,
        required:[true,"please enter password"],
        minLength:[8,"password must be 8 char long"],
        select:false
    },

    gender:{
        type:String,
        enum:['male','female'],
        required:true
    },

    photo:{
        type:String
    },

    
},{timestamps:true});

const User=mongoose.model("user",userSchema);
export default User;
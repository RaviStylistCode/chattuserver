import connectDB from "./Database/database.js";
import {server} from "./app.js";

import dotenv from "dotenv";

dotenv.config({
    path:"./config.env"
});

connectDB();

server.listen(process.env.PORT || 4000,()=>{
    console.log(`Running at http://localhost:${process.env.PORT}`)
})
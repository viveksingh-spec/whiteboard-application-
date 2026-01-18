import mongoose from "mongoose";

const ConnectDB = async()=>{
       try {
           const conn = await mongoose.connect(process.env.DATABASE_URL)
           console.log(`Database is connect host : ${conn.connection.host}`)
       } catch (error) {
           console.error("failed to connect to the database")
           process.exit(1)
       }
}

export {ConnectDB}
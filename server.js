
const app=require('./app')
const dotenv=require('dotenv')
const mongoose=require('mongoose')



dotenv.config({path:"../config.env"})

const db=process.env.DATABASE.replace('<password>',process.env.DATABASE_PASS)
mongoose.connect(/*process.env.DATABASE_LOCAL*/ db ,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    
}).then(()=>console.log("DB CONNECTION SUCCESSFUL"))


const server=app.listen(8080,()=>console.log("server started at 8080"))

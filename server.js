
const app=require('./app')
//const dotenv=require('dotenv')
const mongoose=require('mongoose')



//dotenv.config({path:"../config.env"})

const db=process.env.DATABASE.replace('<password>',process.env.DATABASE_PASS)
mongoose.connect(/*process.env.DATABASE_LOCAL*/ db ,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    
}).then(()=>console.log("DB CONNECTION SUCCESSFUL"))

const port=process.env.PORT || 8080  //.PORT is already set by heroku app and for some reason if not 8080 will be used
const server=app.listen(port,()=>console.log("server started at 8080"))

const path=require('path');
const express=require('express')

const app=express();

app.set('view engine','pug'); // To specify which template generator we are using
app.set('views',path.join(__dirname,'views'))  //To specify which folder our views are present in


//Middlewares
app.use(express.static(path.join(__dirname,'public'))) //While using this we do not need to go to public file to fetch static files, it will automatically get routed and so we only need to type the name of file/folder in public folder


//Routes
app.get('/',(req,res)=>{ //render is used to display the template
    res.status(200).render('base',{
        tour2:"Tour from local variable", //These are variables which can be used inside pug
        user:"AK"
    }) //We do not need to path the file extention bcuz it looks inside views first as we are specified before

})

app.get('/overview',(req,res)=>{
    res.status(200).render('overview',{
        title:"All Tours"
    })
})

app.get('/tour',(eq,res)=>{
    res.status(200).render('tour',{
        title:"The Forest Hiker"
    })
})

module.exports=app;
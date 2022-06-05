const viewRouter=require('./routes/viewRoutes')
const bookingRouter=require('./routes/bookingRoutes')
const tourRouter=require('../natours api/routes/tourRoutes')
const reviewRouter=require('../natours api/routes/reviewRoutes')
const userRouter=require('../natours api/routes/userRoutes')
const path=require('path');
const compression=require('compression')
const express=require('express')
const cookieParser=require('cookie-parser')
const ErrorController=require('../natours api/controllers/errorController')


const app=express();

app.use(express.json())//Body parser , to read the req.body

app.set('view engine','pug'); // To specify which template generator we are using
app.set('views',path.join(__dirname,'views'))  //To specify which folder our views are present in


//Middlewares
app.use(express.static(path.join(__dirname,'public'))) //While using this we do not need to go to public file to fetch static files, it will automatically get routed and so we only need to type the name of file/folder in public folder
app.use(express.urlencoded({extended:true,limit:'10kb'})) //To parse the data send through form submit using action argument and use the req.body from it
app.use(cookieParser()) //This allows to use req.cookie in authController.protect to use the jwt cookie generated

//using compression to compress the text fetched from server
app.use(compression())

//Routes
app.use('/',viewRouter)

//apiRoutes
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/bookings',bookingRouter)

app.use(ErrorController)

module.exports=app;
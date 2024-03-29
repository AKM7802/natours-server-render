const User=require('../model/userModel')
const catchAsync=require('../utils/catchAsync')
const AppError=require('../utils/appError')
const util=require('util')
const sendEmail=require('../email')
const crypto=require('crypto')
//⚪const sendComplexEmail=require('../../Natours Server Rendering/complexEmail')

//npm i jsonwebtoken - It is like passport to check authenticity without pass and userName everytime
const jwt=require('jsonwebtoken')

const signToken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN
}) 
}

const createSendToken=(user,statusCode,res)=>{
    //Creating token
    const token=signToken(user._id)

    //Creating cookie
    // res.cookie('jwt',token,{ ///jwt is cookie name , token is the item stored as cookie ,{}- It includes all the options
    //     expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
    //     secure:true, //It specifies that only send through https and not through http request
    //     httpOnly:true //It specifies that Stores in browser not in localStorage
    // })

    //The above cookie wont work since we cannot run test in https so do the following
    const options={ 
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000), 
        httpOnly:true  //Since this is true we cannot modify or manipulate the cookie
    }
     if (process.env.NODE_ENV==='production') options.secure=true;
    res.cookie('jwt',token,options)

    //To hide password from output  
    user.password=undefined;
    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user
        }
    })
}


exports.signup=catchAsync(async (req,res,next)=>{

    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        role:req.body.role
    });
     
    //For sending complex html email after signup
    //const url='http://localhost:8080/account'
    const url=`${req.protocol}://${req.get('host')}/account`
    //⚪await new sendComplexEmail(newUser,url).sendWelcome()

    //Creating a jwt token to send to the user who signed up
    // const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
    //     expiresIn:process.env.JWT_EXPIRES_IN
    // })


    // const token=signToken(newUser._id)

    // res.status(201).json({
    //     status:"success",
    //     token,
    //     data:{
    //         user:newUser
    //     }
    // })

    createSendToken(newUser,201,res)
    
})

exports.login=catchAsync(async(req,res,next)=>{
    
    const{email,password}=req.body;
    let passCheck;

    //Check if email and password exist
    if(!email || !password){
        return next(new AppError('Please provide email and password!'),400)
    }

    //check if user exist and password is correct 
    const user= await User.findOne({email:email}).select('+password') //+ is used since select is given false in schema
    if (user){passCheck=await user.checkPassword(password,user.password)} //checkPassword is an instance method created in model which can be called for every User collection and docs without importing
   
    if(!user || !passCheck){
        return next(new AppError('Incorrect email or password',401))
    }

    //If everything ok
    // const token=signToken(user._id);
   
    // res.status(200).json({
    //     status:'success',
    //     token
    // })
    createSendToken(user,201,res)
})


//Since cookie is created with httpOnly=true we cannot modify or delete it so we cannot logout by doing the same
//So we create another cookie with same name and less expiry time with no jwt to overwrite the logged in cookie and get it while logout action is performed
exports.logout=(req,res)=>{
    res.cookie('jwt','dummyText instead og token',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.status(200).json({status:"success"})
}

//A sheild middleware to protect from getting all tours details
exports.protect=catchAsync(async (req,res,next)=>{
    //1) Getting token and check if it's there  - Token is send through headers and its name  is authorization and its value should start with Bearer - This is the properway to send a header
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]; // authorization : "Bearer _TOKEN_" so to take _TOKEN_ alone we need to split and fetch the words in position 1
        
    }else if(req.cookies.jwt) token=req.cookies.jwt; //To check if a login cookie is present and if yes pass the value to token
    //console.log(req.headers)
   

    //console.log(token)

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access',401))
    }

    //2) token verification - verify decodes the token to get id and other criterias when we pass token and secret code as parameters
    
    //const decoded=jwt.verify(token,process.env.JWT_SECRET,()=>{})
    //To convert the call back to async we use promisify
    const decoded=await util.promisify(jwt.verify)(token,process.env.JWT_SECRET)
    
    
    //3)Check if user still exists - To make sure that user is not deleted after generating the token (it's a second level protection)
    const currentUser=await User.findById(decoded.id)
    if(!currentUser){
        return next(new AppError("The user belonging to this token does no longer exist.",401))
    }


    //4) Check if user changed password after the token was issued
    if(currentUser.changesPasswordAfter(decoded.iat)){ //changesPasswordAfter is an instance method
        return next(new AppError("User recently changed password! Please login again.",401))
    }

    //Grant access to protected route.
    // console.log(req)
    req.user=currentUser;
    next();
})

//It is almost similer to protect but with few changes like no errors and no headers....
//FOR RENDERED PAGES (used in natours server rendering), no errors displayed just to check if logged in or not for the navbar to change
//we should not use catchAsync here bcuz while logging out we send dummyText as token and so the verification process here fails and forward error to global error handling middleware so we use try catch so that error is generated only using this explicitly
exports.isLoggedIn=async (req,res,next)=>{
   
    
        if(req.cookies.jwt){
          try{  
            //2) token verification - verify decodes the token to get id and other criterias when we pass token and secret code as parameters
            
        
            const decoded=await util.promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
        
            //3)Check if user still exists - To make sure that user is not deleted after generating the token (it's a second level protection)
            const currentUser=await User.findById(decoded.id)
            if(!currentUser){
                return next()
            }
    
    
            //4) Check if user changed password after the token was issued
            if(currentUser.changesPasswordAfter(decoded.iat)){ //changesPasswordAfter is an instance method
                return next()
            }
    
            //If it reaces here then there is a logged in user so, we store the current user in a valiable named 'user'
            res.locals.user=currentUser; //Every templates have access to res.locals so defining a variable inside it can be used anywhere
            return next();
        }catch(err){
            return next()
        }
    }
    next()
    
}


exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError("You do not have permission to perform this action",403))
        }
        next();
    }
}

exports.forgotPassword=async(req,res,next)=>{
    //1) Get user based on posted email
    const user= await User.findOne({email:req.body.email})

    if(!user) return next(new AppError("User with that email does not exist",404))

    //Generate the random reset token
    const resetToken=user.createPasswordForgotToken()
    await user.save({validateBeforeSave:false}) //To turnOff all the validaotrs before saving the user . It is saved so that the token created from the above step gets saved in the db anlong with expiry time


    // 3) send token to user's email

    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message=`Forgot password? Submit a PATCH request with your new password and passwordConfirm to ${resetUrl}.\n If you didn't forgot ur password ignore this email`

    try{
        await sendEmail({
            email:user.email,
            subject:'Your password reset token (valid for 10 mins)',
            message
        })
    
        res.status(200).json({
            status:"success",
            message:'Token sent to email!'
        })
    }catch{
        user.passwordResetToken=undefined
        user.passwordResetExpires=undefined
        await user.save({validateBeforeSave:false})

        return next(new AppError("There was an error sending the email. Please try again later",500))
    }
    
    

}

exports.resetPassword=catchAsync(async(req,res,next)=>{
    // 1) Get user based on the token
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})

    // 2)If token has not expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expired',400))
    }
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();

    // 3) Update changePasswordAt property for the user
    //The above futionality is already created as pre save middleware

    // 4) Log the user in, send JWT
    // const token=signToken(user._id);
    // res.status(200).json({
    //     status:'success',
    //     token
    // })
    createSendToken(user,200,res)

})


//To change password when logged in
exports.updateMyPassword=catchAsync(async(req,res,next)=>{
    // 1) Get user from collection
    const user=await User.findById(req.user._id).select('+password')  //req.user.id is from protect middleware and password is selected false in schema but we require that here

    // 2)Check if posted current password is correct
    if(!user.checkPassword(req.body.currentPassword,user.password)) return next(new AppError('Your current password is wrong',401))

    //3) if so update the password
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();

    //4) Log user in and send JWT
    // const token=signToken(user._id);
   
    // res.status(200).json({
    //     status:'success',
    //     token
    // })
    createSendToken(user,200,res)
})


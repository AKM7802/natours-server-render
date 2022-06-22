const Tour=require('../model/tourModel')
const Review=require('../model/reviewModel')
const User=require('../model/userModel')
const Booking=require('../model/bookingModel')
const AppError=require('../utils/appError')
const catchAsync=require('../utils/catchAsync')

exports.getOverview=catchAsync(async (req,res,next)=>{
    const tours=await Tour.find();

    res.status(200).render('overview',{
        title:"All Tours",
        tours
    })
    next()
})

exports.getTour=catchAsync(async (req,res,next)=>{
    const tour=await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        select:'user rating review'
    }).populate('guides')

    if(!tour){
        return next(new AppError('There is no tour with that name',404))
    }
    res.status(200).render('tour',{
        title:tour.name,
        tour
    })
    next()
})

exports.getLoginForm= (req,res)=>{
        
    res.status(200).render('login',{
        title:"LoginPage"
    })
}

exports.getAccountInfo= (req,res)=>{

    res.status(200).render('account',{
        title:"Account Info"
    })
}

exports.getMyTours=catchAsync(async (req,res,next)=>{
    //1)Find all bookings
    const bookings=await Booking.find({user:req.user.id})

    console.log(bookings)
    //2)Find tours with the returned IDs
    const tourIDs=bookings.map(el=>el.tour)
    const tours=await Tour.find({_id:{$in:tourIDs}})  //return all ids which are in the array tourIDs 

    res.status(200).render('overview',{
        title:'My Tours',
        tours
    })
})


exports.updateUserData=catchAsync(async (req,res,next)=>{
    const updatedUser=await User.findByIdAndUpdate(req.user.id,{
        name:req.body.name,
        email:req.body.email
    },{
        new:true, //To receive the updated details
        runValidators:true
    })
    console.log("HEllo")
    console.log(updatedUser)
    res.status(200).render('account',{
        title:"Account Info",
        user:updatedUser //This should be specified bcuz otherwise the details of old user will be shown from the protect middleware
    })
    
})
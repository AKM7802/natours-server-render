const stripe=require('stripe')('sk_test_51KrcN8SAu8DyRGr4CA2HlC7wmYnvx3dZUr7qsrUPJ4dh8u0IdVMWoiy3P3Vso5WGjZpiF2sLQqE5W08Ku5d682eh00mIdyLRzq')
const Tour=require('../../natours api/models/tourModel')
const Booking=require('../../natours api/models/bookingModel')
const AppError=require('../../natours api/utils/appError')
const catchAsync=require('../../natours api/utils/catchAsync')
const factory=require('../../natours api/controllers/handlerFactory')

exports.getCheckoutSession=catchAsync(async (req,res,next)=>{
    //1) Get the currently booked tour
    const tour=await Tour.findById(req.params.tourId);
    

    //2) Create checkout session
    const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        mode:'payment',
        line_items:[{
            name:`${tour.name} Tour`,
            description:tour.summary,
            images:[`https://www.natours.dev/img/tours/${tour.imageCover}`],
            amount:tour.price,
            currency:'usd',
            quantity:1
        }]
    })

    //3) Create session as response
    // res.status(200).json({
    //     status:'success',
    //     session
    // })

    res.redirect(303,session.url)
})

exports.createBookingCheckout=catchAsync(async (req,res,next)=>{
    //This is only TEMPORARY , because it's not secure and everyone can make bookings without paying by just knowing the url.
    const{tour,user,price}=req.query;

    if(!tour && !user && !price) return next();
    await Booking.create({tour,user,price});

    //next(); This will call the further url with queries attached so to remove and redirect original home page without queries we use the below
    res.redirect(req.originalUrl.split('?')[0]);
})

exports.createBooking=factory.createOne(Booking);
exports.getBooking=factory.getOne(Booking);
exports.getAllBookings=factory.getAll(Booking)
exports.updateBooking=factory.updateOne(Booking)
exports.deleteBooking=factory.createOne(Booking);
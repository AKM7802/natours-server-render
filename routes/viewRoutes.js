const express=require('express')
const viewController=require('../controller/viewController')
const authController=require('../controller/authController')
const bookingController=require('../controller/bookingController')

const router=express.Router()

//router.use(authController.isLoggedIn) //Using this checks if logged in and if yes store it in 'user' variable which can be used in any templates in the routes specified below


router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn,viewController.getOverview)

router.get('/tour/:slug',authController.isLoggedIn,viewController.getTour)

router.get('/login',viewController.getLoginForm)

router.get('/account',authController.isLoggedIn,viewController.getAccountInfo)

router.get('/my-tours',authController.protect,viewController.getMyTours)


//FOR WITHOUT API FORM SUBMIT
router.post('/submit-user-data',authController.protect,viewController.updateUserData)

module.exports=router;



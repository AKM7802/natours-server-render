// import axios from 'axios';
// import {showAlert} from './alerts.js'


// const stripe=Stripe('pk_test_51KrcN8SAu8DyRGr4B9Y5pyHiZes2iKkEC8l26SoQWHkz0kMbKXdf6KOKy6WC2ok9khvGdpZEWONhhOIAxRX6CFxg00m3cCtytu')  //stripe is already added in tour.js as script so we can use it anywhere and it accepts public key provided by stripe inside
// console.log(stripe)
// export const bookTour=async tourId=>{
//     try{
//         //1) Get checkout session from API
//         const session=await axios(`http://localhost:8080/api/v1/bookings/checkout-session/${tourId}`)
//         //console.log(session)

//         //2) Create checkout form + change credit card
//          await stripe.redirectToCheckout({
//              sessionId:session.data.session.id
//          })
        

//     }catch(err){
//         console.log(err)
//         showAlert('error',err)
//     }
// }

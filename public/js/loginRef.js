import axios from 'axios';
import {showAlert} from './alerts'
import 'regenerator-runtime/runtime'

export const login=async (email,password)=>{
    try{
     const res=await axios({
         method:'POST',
         url:"https://natours-ak-api.herokuapp.com/api/v1/users/login",
         data:{
             email,
             password
         }
 
     })
     
     if(res.data.status==="success"){
         showAlert("success","Logged in successfully!")
         //To route to home page after logged in in 1.5sec
         window.setTimeout(()=>{
             location.assign('/');
         },1500)
     }
     
    }catch(err){
        showAlert("error",err.response.data.message)
 
    }
     
     
 }
 
 export const logout=async ()=>{
     try{
        const res=await axios({
            method:'GET',
            url:'http://localhost:8080/api/v1/users/logout'
        })
        
        console.log(res.data.status)
        
        if(res.data.status==='success'){
           // location.reload(true) //It is used to reload page, true specified reload should be done from server and not from browser cahce
            location.assign('/')
        }


     }catch(err){
         showAlert('error','Error logging out! Try again.')
     }

 }

import axios from 'axios';
import {showAlert} from './alerts'
import 'regenerator-runtime/runtime'
import '@babel/polyfill'

export const updateData=async (data,type)=>{
    try{
        const url= type==='Password' ? "http://localhost:8080/api/v1/users/updateMyPassword" : "http://localhost:8080/api/v1/users/updateMe"


        const res=await axios({
            method:'PATCH',
            url,
            data
        })

        

        if(res.data.status==="success"){
            showAlert("success",`${type} updated successfully!`)
            
        }
       
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}
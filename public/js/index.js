//EXPLANATION FOR watch:js in package.json
//It specifies the start point as indexjs which should contaill all the js scripts which can be used under the main pug file as bundle.js

//------------------------------------------------------------------------------------------------------------------------
import {login,logout} from './loginRef';
import '@babel/polyfill'
import 'regenerator-runtime/runtime'
import {displayMap} from './mapboxRef'
import { updateData } from './updateSettings';
import { bookTour } from './stripe';

const mapbox=document.getElementById('map')
const logoutBtn=document.querySelector('.nav-logout')
const loginForm=document.querySelector('.form')
const updateSettingsForm=document.querySelector('.settings-form')
const updatePasswordForm=document.querySelector('.password-form')
const bookBtn=document.getElementById('book-tour')

if(mapbox){
    const locations=JSON.parse(mapbox.dataset.location)
    displayMap(locations)
}

if(loginForm){
    loginForm.addEventListener('submit',e=>{
        e.preventDefault();
        const email=document.getElementById('email').value
        const password=document.getElementById('password').value
        login(email,password)
    })
}


if(logoutBtn){
    logoutBtn.addEventListener('click',logout)
}

if(updateSettingsForm){
    updateSettingsForm.addEventListener('submit',e=>{
        e.preventDefault();
        //For uploading data other than files like image
        // const email=document.getElementById('email').value
        // const name=document.getElementById('name').value
        // updateData({name,email},"Data");

        //For uploading data with files 
        const form=new FormData();
        form.append('name',document.getElementById('name').value)
        form.append('email',document.getElementById('email').value)
        form.append('photo',document.getElementById('photo').files[0])

        updateData(form,'data');
    })
}

if(updatePasswordForm){
    
    updatePasswordForm.addEventListener('submit',async e=>{
        e.preventDefault();
        const currentPassword=document.getElementById('currentPassword').value
        const password=document.getElementById('newPassword').value
        const passwordConfirm=document.getElementById('confirmPassword').value

        document.getElementById('passwordSubmit').value="Updating . . ."
        await updateData({currentPassword,password,passwordConfirm},"Password")

        document.getElementById('passwordSubmit').value="CHANGE PASSWORD"
        document.getElementById('currentPassword').value=""
        document.getElementById('newPassword').value=""
        document.getElementById('confirmPassword').value=""


    })
}

if(bookBtn){
    bookBtn.addEventListener('click',e=>{
        e.target.textContent="Processing"
        const {tourId}=e.target.dataset
        bookTour(tourId)
    })
}


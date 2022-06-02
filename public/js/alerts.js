const hideAlert=()=>{
    const el=document.querySelector('.alert')
    if(el) el.parentElement.removeChild(el)
}

//type is 'success' or 'error'
export const showAlert=(type,msg)=>{
    hideAlert() //To hide any alert if present already
    const markup=`<div class='alert alert--${type}'>${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(hideAlert,5000); //To automatically hide the generated alert after 5 sec

}
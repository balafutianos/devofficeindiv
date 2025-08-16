// eslint-disable-next-line no-unused-vars
function Validation(values){
    let error = {}
    const email_patern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

if(values.email === ""){
    error.email = "Email Field should not be empty"
}
else if(!email_patern.test(values.email)){
    error.email = "Email didnt match"
}else{
    error.email=""
}

if(values.password === ""){
    error.password = "Password field should not be empty"
}

else if(!password_pattern.test(values.password)){
    error.password = "Password is wrong"
}else{
    error.password = ""
}
return error;
}

export default Validation;
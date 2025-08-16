// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Validation from './LoginValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReCAPTCHA from 'react-google-recaptcha';
import './login.css'; // Importing login.css file

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false
  });

  const navigate = useNavigate();
  const [captchaVerified, setCaptchaVerified] = useState(false); // Initialize captchaVerified state variable

  const onChange = () =>{
    setCaptchaVerified(true); // Update captchaVerified state variable when reCAPTCHA is verified
  }

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setValues(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    
    // Check if reCAPTCHA is verified
    if (errors.email === "" && errors.password === "") {
      if (!captchaVerified) {
        alert("Please complete the reCAPTCHA before submitting the form.");
        return; // Prevent further execution
      }
  
      axios.post('http://localhost:8081/login', values)
        .then(res => {
          if (res.data.Login) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("isLogedIn", true); // Set isLogedIn flag to true in localStorage
            localStorage.setItem("role", res.data.data[0].role); // Save user role
            
            if (res.data.data[0].role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/user');
            }
          } else {
            alert("No record existed");
          }
        })
        .catch(err => console.log(err));
    }
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 19 || currentHour < 7) {
      document.body.classList.add('night-mode'); 
    } else {
      document.body.classList.remove('night-mode'); 
    }
  }, []); 

  return (
    <div className="wrapper">
      <div className="text-center mt-4 name">
        Welcome Back!
      </div>
      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-envelope"></span>
          <input type="email" name="email" id="email" placeholder="Email or username" value={values.email} onChange={handleInput} />
        </div>
        {errors.email && <div className='text-danger'>{errors.email}</div>}
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input type={values.showPassword ? "text" : "password"} name="password" id="pwd" placeholder="Password" value={values.password} onChange={handleInput} />
          <button type="button" onClick={togglePasswordVisibility} className="btn btn-light"  style={{ width: '58px', height: '38px', padding: '0' }}>
  {values.showPassword ? (
    <>
      <span style={{ fontSize: '12px' }}>Hide</span> <i className="fas fa-eye-slash"></i>
    </>
  ) : (
    <>
      <span style={{ fontSize: '13px' }}>Show</span> <i className="fas fa-eye"></i>
    </>
  )}
</button>



        </div>
        {errors.password && <div className='text-danger'>{errors.password}</div>}
       
        <ReCAPTCHA
          sitekey="6LcFkYMpAAAAACTt1EJ_10_zh0pNEcwiKHZWitIN"
          onChange={onChange}
        />
        <button type='submit' className="btn mt-3">Login</button>
      </form>
      <div className="text-center fs-6">
        <a href="#">Forgot your password?</a>
      </div>
    </div>
  );
}

export default Login;
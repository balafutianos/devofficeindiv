import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validation from './SignupValidation'; 
import axios from 'axios';

function Signup() {
  const [values, setValues] = useState({
    firstname: '',
    lastname:'',
    email: '',
    username:'',
    password: '',
    specialization:'',
    role:''
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    if(errors.firstname ==="" && errors.lastname ==="" && errors.email ==="" && errors.username ==="" && errors.password ==="" && errors.role ==="" && errors.specialization ===""){
        axios.post('http://localhost:8081/signup', values)
        .then(res => {
           navigate('/');
        })
        .catch(err => console.log(err));
    }

  
  };

  return (
    <div className="wrapper">
      <div className="text-center mt-4 name">
        User Registration Portal
      </div>
      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field d-flex align-items-center"> 
          <input type="text" name="firstname" placeholder="Enter Name" value={values.firstname} onChange={handleInput} />
          {errors.firstname && <div className='text-danger'>{errors.firstname}</div>}
        </div>

        <div className="form-field d-flex align-items-center"> 
          <input type="text" name="lastname" placeholder="Enter Last Name" value={values.lastname} onChange={handleInput} />
          {errors.lastname && <div className='text-danger'>{errors.lastname}</div>}
        </div>
        
        <div className="form-field d-flex align-items-center"> 
          <input type="text" name="email" placeholder="Enter Email" value={values.email} onChange={handleInput} />
          {errors.email && <div className='text-danger'>{errors.email}</div>}
        </div>

        <div className="form-field d-flex align-items-center"> 
          <input type="text" name="username" placeholder="Enter Username" value={values.username} onChange={handleInput} />
          {errors.username && <div className='text-danger'>{errors.username}</div>}
        </div>

        <div className="form-field d-flex align-items-center">
          <input type="password" name="password" placeholder="Password" value={values.password} onChange={handleInput} />
          {errors.password && <div className='text-danger'>{errors.password}</div>}
        </div>

          <select 
            style={{
              padding: '10px',
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#fff',
              fontSize: '16px',
              color: '#333',
              marginBottom: '20px'
            }} 
            name="role" 
            value={values.role} 
            onChange={handleInput}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          {errors.role && <div className='text-danger'>{errors.role}</div>}
        

  <select
    style={{
      padding: '10px',
      width: '100%',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#fff',
      fontSize: '16px',
      color: '#333',
      marginBottom: '20px'
    }}
    name="specialization"
    value={values.specialization}
    onChange={handleInput}
  >
    <option value="">Select Specialization</option>
    <option value="Frontend">Front-end Developer</option>
    <option value="Backend">Back-end Developer</option>
    
    
  </select>
  {errors.specialization && <div className='text-danger'>{errors.specialization}</div>}




        
        <button type='submit' className="btn mt-3">Confirm Registration</button>
      </form>
      
    </div>
  );
}

export default Signup;

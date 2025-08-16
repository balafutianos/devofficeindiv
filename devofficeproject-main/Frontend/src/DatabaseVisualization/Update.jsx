// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Update() {
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        username: '',
        role: '',
        specialization: '',
        email: ''
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8081/${id}`)
            .then(res => setUser(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:8081/update/${id}`, user)
            .then(() => {
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="wrapper">
            <div className="text-center mt-4 name">
                EDIT USER
            </div>
            <form className="p-3 mt-3" onSubmit={handleSubmit}>
                <div className="form-field d-flex align-items-center">
                    <input type="text" name="firstname" value={user.firstname} placeholder="Enter Name" onChange={handleChange} />
                </div>

                <div className="form-field d-flex align-items-center">
                    <input type="text" name="lastname" value={user.lastname} placeholder="Enter Last Name" onChange={handleChange} />
                </div>

                <div className="form-field d-flex align-items-center">
                    <input type="text" name="email" value={user.email} placeholder="Enter Email" onChange={handleChange} />
                </div>

                <div className="form-field d-flex align-items-center">
                    <input type="text" name="username" value={user.username} placeholder="Enter Username" onChange={handleChange} />
                </div>

                <div className="form-field d-flex align-items-center">
                    <input type="text" name="role" value={user.role} placeholder="Role" onChange={handleChange} />
                </div>

                <div className="form-field d-flex align-items-center">
                    <input type="text" name="specialization" value={user.specialization} placeholder="Specialization" onChange={handleChange} />
                </div>

                <button type='submit' className="btn mt-3">Confirm Registration</button>
            </form>
        </div>
    );
}

export default Update;

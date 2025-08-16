// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Users() {
    const [users, setUsers] = useState([]);
    const [selectedOption, setSelectedOption] = useState('Users');

    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));
    }, []);

    const navigate = useNavigate();

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8081/delete/${id}`)
            .then(() => {
                setUsers(users.filter(user => user.id !== id)); // Remove the deleted user from the state
            })
            .catch(err => console.log(err));
    };

    const handleDropdownChange = (option) => {
        setSelectedOption(option);
        if (option === 'Seats') {
            navigate('/seatsdtb');
        }
    };

    return (
        <div className='d-flex vh-200 bg-primary justify-content-center align-items-center'>
            <div className='w-100 bg-white rounded p-3'>
                <div className="dropdown mb-3">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        {selectedOption}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><button className="dropdown-item" onClick={() => handleDropdownChange('Users')}>Users</button></li>
                        <li><button className="dropdown-item" onClick={() => handleDropdownChange('Seats')}>Seats</button></li>
                        <li><button className="dropdown-item" onClick={() => setSelectedOption('Feedback')}>Feedback</button></li>
                    </ul>
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th><strong>Role</strong></th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Specialization</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((data, i) => (
                            <tr key={i}>
                                <td>{data.id}</td>
                                <td>{data.role}</td>
                                <td>{data.username}</td>
                                <td>{data.firstname}</td>
                                <td>{data.lastname}</td>
                                <td>{data.email}</td>
                                <td>{data.password}</td>
                                <td>{data.specialization}</td>
                                <td>
                                    <Link to={`/update/${data.id}`}>
                                        <span className="me-1"><i className="bi bi-pencil"></i></span>
                                    </Link>
                                    <button onClick={() => handleDelete(data.id)} className='btn btn-danger fs-13'>
                                        <span className="me-1"><i className="bi bi-trash"></i></span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;

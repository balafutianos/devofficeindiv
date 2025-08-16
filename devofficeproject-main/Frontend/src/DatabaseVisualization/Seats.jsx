// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Seats() {
    const [seats, setSeats] = useState([]);
    const [selectedOption, setSelectedOption] = useState('Seats');

    useEffect(() => {
        axios.get('http://localhost:8081/seats') // Assuming the seats data is available at this endpoint
            .then(res => setSeats(res.data))
            .catch(err => console.log(err));
    }, []);

    const navigate = useNavigate();

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8081/seats/${id}`) // Assuming delete endpoint for seats
            .then(() => {
                setSeats(seats.filter(seat => seat.id !== id)); // Remove the deleted seat from the state
            })
            .catch(err => console.log(err));
    };

    const handleDropdownChange = (option) => {
        setSelectedOption(option);
        if (option === 'Users') {
            navigate('/databasevis');
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
                            <th>Seat Number</th>
                            <th>Row</th>
                            <th>Section</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seats.map((data, i) => (
                            <tr key={i}>
                                <td>{data.id}</td>
                                <td>{data.seatnumber}</td>
                                <td>{data.status}</td>
                                <td>{data.description}</td>
                                <td>{data.last_booked}</td>
                                <td>
                                    <Link to={`/update-seat/${data.id}`}>
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

export default Seats;

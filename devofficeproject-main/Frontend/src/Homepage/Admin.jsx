// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();
    const [lastBooked, setLastBooked] = useState('');
    const [booking, setBooking] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [avatar, setAvatar] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Added state for editing mode
    const [file, setFile] = useState();

    // Fetch authenticated user data
    const handleAuth = () => {
        axios.get('http://localhost:8081/checkauth', {
            headers: {
                'access-token': localStorage.getItem('token')
            }
        })
        .then(res => {
            setBooking(res.data.booking);
            setLastBooked(res.data.last_booked);
            setUsername(res.data.username);
            setAvatar(res.data.avatar);
            setFirstname(res.data.firstname);
            setLastname(res.data.lastname);
            setRole(res.data.role);
            setEmail(res.data.email);
            setSpecialization(res.data.specialization);
        })
        .catch(err => console.log(err));
    };

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        const formdata = new FormData();
        formdata.append('image', file);

        const token = localStorage.getItem('token');

        axios.post('http://localhost:8081/upload', formdata, {
            headers: {
                'access-token': token,
            },
        })
        .then((res) => {
            if (res.data.Status === 'Success') {
                console.log('Succeeded');
                handleAuth(); // Refresh user data to get the new avatar
            } else {
                console.log('Failed');
            }
        })
        .catch((err) => console.log(err));
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.post('http://localhost:8081/updateprofile', {
            firstname,
            lastname,
            username,
            email,
            role,
            specialization
        }, {
            headers: {
                'access-token': token,
            },
        })
        .then((res) => {
            if (res.data.Status === 'Success') {
                console.log('Profile Updated');
                setIsEditing(false);
                handleAuth(); // Refresh user data
            } else {
                console.log('Update Failed');
            }
        })
        .catch((err) => console.log(err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    useEffect(() => {
        handleAuth();
    }, []);

    useEffect(() => {
        // Fetch all seats data
        axios.get('http://localhost:8081/seats')
        .then(res => {
            // Filter out the data for seat 6
            const seat6 = res.data.find(seat => seat.seatnumber === 6);
            if (seat6) {
                // Extract the date portion without the time
                const lastBookedDate = new Date(seat6.last_booked).toISOString().split('T')[0];
                setLastBooked(lastBookedDate);
            }
        })
        .catch(err => console.log(err));
    }, []);

    const openGmail = () => {
        window.open('https://mail.google.com/', '_blank');
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='bg-dark col-auto col-md-3 min-vh-100'>
                    <a className='text-decoration-none text-white d-flex align-itemcenter ms-3 mt-2'>
                        <i className='bi bi-react'></i>
                        <strong className='ms-1 fs-4'>Devoffice</strong>
                    </a>
                    <hr />
                    <ul className='nav nav-pills flex-column'>
                        <li className='nav-item text-white fs-4'>
                            <Link to="/admin" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-house'></i>
                                <span className='ms-2'>Home</span>
                            </Link>
                        </li>

                        <li className='nav-item text-white fs-4'>
                            <Link to="/signup" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-person-plus'></i>
                                <span className='ms-2'>Register new User</span>
                            </Link>
                        </li>

                        <li className='nav-item text-white fs-4'>
                            <Link to="/databasevis" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-database'></i>
                                <span className='ms-2'>Database</span>
                            </Link>
                        </li>

                        <li className='nav-item text-white fs-4'>
                            <Link to="/frontroom" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-calendar'></i>
                                <span className='ms-2'>Book a seat</span>
                            </Link>
                        </li>
                        <li className='nav-item text-white fs-4'>
                            <a href="/chat" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-chat'></i>
                                <span className='ms-2'>DevOffice Meetings</span>
                            </a>
                        </li>
                        <li className='nav-item text-white fs-4'>
                            <a href="/email" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-envelope'></i>
                                <span className='ms-2'>Email</span>
                            </a>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '70px', marginBottom: '-120px' }}
                            className="text-white fs-4 me-2"
                            onClick={() => setShowUploadOptions(!showUploadOptions)} // Toggle upload options
                        >
                            <span style={{ fontSize: '20px' }}>{username}</span>
                            <div style={{ marginLeft: '120px', marginTop: '-48px' }}>
                                <button className='btn btn-danger mt-3 ms-3' onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                        <div className="avatar-container">
                            {avatar && (
                                <img
                                    src={`http://localhost:8081/images/${avatar}`}
                                    alt="Avatar"
                                    style={{ width: '47px', height: '47px', borderRadius: '30%', border: '3px solid #f0f0f0', boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)', marginLeft: '-120px', marginBottom: '-120px' }}
                                />
                            )}
                        </div>
                        {showUploadOptions && (
                            <div>
                                <input type="file" onChange={handleFile} />
                                <button onClick={handleUpload}>Upload</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-md-9 p-4">
                    <div style={{ background: 'linear-gradient(45deg, #000000, #424344)', color: 'white', padding: '20px', borderRadius: '10px', position: 'relative' }}>
                        <h1>Welcome Back</h1>
                        <p>We're glad to see you again, {username}!</p>
                        <button
                            className="btn btn-light"
                            style={{ position: 'absolute', top: '20px', right: '20px' }}
                            onClick={openGmail}
                        >
                            <i className="bi bi-envelope"></i>
                        </button>
                    </div>
                    <div className="container">
                        <div className="profile-card" style={{ background: 'linear-gradient(45deg, #000000, #424344)', color: 'white', padding: '10px', width: '353px', height: '503px', borderRadius: '10px', position: 'relative', top: '23px', overflow: 'hidden' }}>
                            <p style={{ fontSize: '29px' }}>Profile</p>
                            <br />
                            <button className='btn btn-primary' onClick={() => setIsEditing(!isEditing)}>Edit</button>
                            {avatar && (
                                <img
                                    src={`http://localhost:8081/images/${avatar}`}
                                    alt="Avatar"
                                    style={{ width: '107px', height: '107px', borderRadius: '30%', border: '3px solid #f0f0f0', boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)', position: 'relative', top: '-33px', left: '153px' }}
                                />
                            )}
                            <br />
                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} style={{ overflowY: 'auto', maxHeight: '300px' }}>
                                    <div className="mb-3">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Role</label>
                                        <input type="text" className="form-control" value={role} onChange={(e) => setRole(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Specialization</label>
                                        <input type="text" className="form-control" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Update Profile</button>
                                </form>
                            ) : (
                                <>
                                    <p>First name: {firstname}</p>
                                    <p>Last name: {lastname}</p>
                                    <p>Username: {username}</p>
                                    <p>Email: {email}</p>
                                    <p>Specialization: {specialization}</p>
                                    <p>Role: {role}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div style={{ background: 'linear-gradient(45deg, #000000, #424344)', fontSize: '16px', color: 'white', padding: '10px', width: '323px', height: '193px', borderRadius: '10px', position: 'relative', top: '-476px', left: '484px' }}>
                        <p>Total Seat Reservations</p>
                        <p style={{ fontSize: '64px' }}>8</p>
                    </div>

                    <div style={{ background: 'linear-gradient(45deg, #000000, #424344)', fontSize: '16px', color: 'white', padding: '10px', width: '332px', height: '193px', borderRadius: '10px', position: 'relative', top: '-423px', left: '484px' }}>
                        <p>Upcoming Reservations(Booked)</p>
                        <p style={{ fontSize: '34px' }}>{lastBooked}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;

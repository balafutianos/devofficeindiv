import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

function User() {
    const navigate = useNavigate();
    const [last_booked, setLastBooked] = useState('');
    const [booking, setBooking] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [avatar, setAvatar] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [showUploadOptions, setShowUploadOptions] = useState(false); 

    // Token Initialization
    const handleAuth = () => {
      axios.get('http://localhost:8081/checkauth', {
          headers: {
              'access-token': localStorage.getItem("token")
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
  

    const [file, setFile] = useState();
    const handleFile = (e) => {
      setFile(e.target.files[0]);
    };
    const handleUpload = () => {
        const formdata = new FormData();
        formdata.append('image', file);
    
        const token = localStorage.getItem('token');
    
        axios
          .post('http://localhost:8081/upload', formdata, {
            headers: {
              'access-token': token,
            },
          })
          .then((res) => {
            if (res.data.Status === 'Success') {
              console.log('Succeeded');
            } else {
              console.log('Failed');
            }
          })
          .catch((err) => console.log(err));
      };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    useEffect(() => {
        handleAuth();  
    }, []);

    // Inside your React component
// Inside your React component
useEffect(() => {
  // Fetch all seats data
  axios.get('http://localhost:8081/seats')
  .then(res => {
      // Filter out the data for seat 6
      const seat20 = res.data.find(seat => seat.seatnumber === 20);
      if (seat20) {
          // Extract the date portion without the time
          const lastBookedDate = new Date(seat20.last_booked).toISOString().split('T')[0];
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
                            <Link to="/user" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-house'></i>
                                <span className='ms-2'>Home</span>
                            </Link>
                        </li>

                        <li className='nav-item text-white fs-4'>
                        <Link to="/frontroomuser" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-calendar'></i>
                                <span className='ms-2'>Book a seat</span>
                            </Link>
                        </li>
                        <li className='nav-item text-white fs-4'>
                            <a href="/chatuser" className='nav-link text-white fs-5' aria-current='page'>
                                <i className='bi bi-chat'></i>
                                <span className='ms-2'>DevOffice Meetings</span>
                            </a>
                        </li>
                        <li className='nav-item text-white fs-4'>
                            <a href="/emailuser" className='nav-link text-white fs-5' aria-current='page'>
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
                              style={{ width: '47px', height: '47px', borderRadius: '30%',border: '3px solid #f0f0f0',boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)', marginLeft: '-120px', marginBottom: '-120px' }}
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
                    <div style={{ background: 'linear-gradient(45deg, #000000, #424344)', color: 'white', padding: '10px', width:'353px', height:'503px', borderRadius: '10px', position: 'relative', top:'23px' }}>

                       
                        <p style={{fontSize:'29px'}}>Profile</p>
                        <br>

                        </br>
                        <button className='btn btn-primary'>Edit</button>
                        <p>{avatar && (
                            <img
                              src={`http://localhost:8081/images/${avatar}`}
                              alt="Avatar"
                              style={{ width: '107px', height: '107px', borderRadius: '30%',border: '3px solid #f0f0f0',boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)',position: 'relative', top:'-33px', left:'153px' }}
                            />
                            
                          )}</p>
                          
                          <br>
                          </br>
                          

                          <p>
                            First name: {firstname}
                          </p>

                          <p>
                            Last name: {lastname}
                          </p>
                          <p>
                             username: {username}
                          </p>
                          <p>
                            Email: {email}
                          </p>
                          <p>
                            specialization: {specialization}
                          </p>
                          <p>
                            Role: {role}
                          </p>

                          
                    </div>
                    
                </div>
            </div>
            <div className="col-md-9 p-4">
            <div style={{ background: 'linear-gradient(45deg, #000000, #424344)',fontSize:'16px', color: 'white', padding: '10px', width:'323px', height:'193px', borderRadius: '10px', position: 'relative', top:'-523px',left:'884px' }}>
                    <p>Total Seat Reservations</p>
                    <p style={{ fontSize: '64px' }}>8</p>
                </div>
            
        </div>

        <div className="col-md-9 p-4">
            <div style={{ background: 'linear-gradient(45deg, #000000, #424344)',fontSize:'16px', color: 'white', padding: '10px', width:'332px', height:'193px', borderRadius: '10px', position: 'relative', top:'-523px',left:'884px' }}>
                    <p>Upcoming Reservations(Booked)</p>
                    <p style={{ fontSize: '34px' }}>{last_booked}</p>
                </div>
            
        </div>
        </div>
        
    );
    
}

export default User;

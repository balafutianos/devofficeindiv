// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Style from './Frontroom.module.css';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Frontend() {
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingName, setBookingName] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

 
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

  useEffect(() => {
    console.log("Selected Date:", selectedDate.toISOString().slice(0, 10));
  
    axios
      .get('http://localhost:8081/seats', {
        params: {
          date: selectedDate.toISOString().slice(0, 10),
        },
      })
      .then((response) => {
        console.log("Seat Data:", response.data);
        const updatedSeats = response.data.map((seat) => {
          return {
            ...seat,
            status: seat.status === 'occupied' ? 'occupied' : 'available',
          };
        });
        setSeats(updatedSeats);
      })
      .catch((error) => {
        console.error('Error fetching seat data:', error);
      });
    
    // Fetch user information
    axios
      .get('http://localhost:8081/checkauth', {
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setUsername(res.data.username);
        setAvatar(res.data.avatar);
      })
      .catch((err) => console.log(err));
  }, [selectedDate]); // This dependency array ensures that this effect runs whenever selectedDate changes
  
  
  
  const handleSeatClick = (seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat);
      setShowBookingForm(true);
    }
  };

  

  

  const handleSubmitBooking = () => {
    axios
      .put(`http://localhost:8081/updateseat/${selectedSeat.id}`, {
        selectedDate: selectedDate.toISOString().slice(0, 10), // Use selectedDate directly
        bookedBy: bookingName,
      })
      .then((response) => {
        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.id === selectedSeat.id ? { ...seat, status: 'occupied' } : seat
          )
        );
        setSelectedSeat(null);
        setBookingName('');
        setShowBookingForm(false);
      })
      .catch((error) => {
        console.error('Error updating seat status:', error);
      });
  };


 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


 

  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="bg-dark col-auto col-md-2 min-vh-100">
          <a className="text-decoration-none text-white d-flex align-itemcenter ms-3 mt-2">
            <i className="bi bi-react"></i>
            <strong className="ms-1 fs-4">Devoffice</strong>
          </a>
          <hr />
          <ul className="nav nav-pills flex-column">
            <li className="nav-item text-white fs-4">
              <Link to="/user" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-house"></i>
                <span className="ms-1">Home</span>
              </Link>
            </li>
            
            <li className="nav-item text-white fs-4">
              <Link to="/frontroom" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-calendar"></i>
                <span className="ms-2">Book a seat</span>
              </Link>
            </li>
            <li className="nav-item text-white fs-4">
              <a href="#" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-chat"></i>
                <span className="ms-2">DevOffice Meetings</span>
              </a>
            </li>
            <li className="nav-item text-white fs-4">
              <a href="/email" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-envelope"></i>
                <span className="ms-2">Email</span>
              </a>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                marginLeft: '50px',
              }}
              className="text-white fs-4 me-2"
              onClick={() => setShowUploadOptions(!showUploadOptions)}
            >
              <span style={{ fontSize: '20px' }}>{username}</span>
            </div>
            <div className="avatar-container">
              {avatar && (
                <img
                  src={`http://localhost:8081/images/${avatar}`}
                  alt="Avatar"
                  style={{
                    width: '47px',
                    height: '47px',
                    borderRadius: '30%',
                    border: '3px solid #f0f0f0',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
                    marginLeft: '-120px',
                  }}
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
          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={`col ${Style.App}`}>
          <h1 className={Style.roomName}>Frontend Room 1FRP</h1>
          <div style={{ marginTop: '-1360px', marginLeft: '540px' }}>
            <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
          </div>
          <div className="seats-container">
            <div className={Style.wall}></div>
            <div className={Style.secondWall}></div>
            <div className={Style.thirdWall}></div>
            <div className={Style.fourthWall}></div>

            {seats.map((seat, index) => {
 
    // Render only if the seat is not in droppedSeats
    return (
      <button
        key={seat.id}
        className={`${Style.seat} ${
          seat.status === 'available' ? Style.available : ''
        } ${
          seat.status === 'occupied' ? Style.occupied : ''
        } ${
          index === 0 ? Style.firstSeat : ''
        } ${
          index === 1 ? Style.secondSeat : ''
        } ${
          index === 2 ? Style.thirdSeat : ''
        } ${
          index === 3 ? Style.fourthSeat : ''
        } ${
          index === 4 ? Style.fifthSeat : ''
        } ${
          index === 5 ? Style.sixthSeat : ''
        } ${
          index === 6 ? Style.seventhSeat : ''
        } ${
          index === 7 ? Style.eigthSeat : ''
        } ${
          index === 8 ? Style.ninethSeat : ''
        } ${
          index === 9 ? Style.tenthSeat : ''
        } ${
          index === 10 ? Style.eleventhSeat : ''
        } ${
          index === 11 ? Style.twelfthSeat : ''
        } ${
          index === 12 ? Style.thirteenthSeat : ''
        } ${
          index === 13 ? Style.fourteenthSeat : ''
        } ${
          index === 14 ? Style.fifteenthSeat : ''
        } ${
          index === 15 ? Style.sixteenthSeat : ''
        } ${
          index === 16 ? Style.seventeenthSeat : ''
        } ${
          index === 17 ? Style.eighteenthSeat : ''
        } ${
          index === 18 ? Style.nineteenthSeat : ''
        } ${
          index === 19 ? Style.twentiethSeat : ''
        } ${
          index === 20 ? Style.twentyoneSeat : ''
        } ${
          index === 21 ? Style.twentytwoSeat : ''
        } ${
          index === 22 ? Style.twentythreeSeat : ''
        } ${
          index === 23 ? Style.twentyfourSeat : ''
        }`}
        onClick={() => {
          handleSeatClick(seat);
          
        }}
      
      
       
       
        disabled={seat.status === 'occupied'}
        draggable
      >
        <p>{seat.seatnumber}</p>
      </button>
    );
  
})}
{showBookingForm && (
            <div className={Style.bookingForm}>
              <button onClick={handleSubmitBooking}>Book Seat</button>
            </div>
          )}
          
          </div>

        
        </div>
      </div>
    </div>
  );
}

export default Frontend;

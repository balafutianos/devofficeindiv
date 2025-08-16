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
  const [selectedSeatToDelete, setSelectedSeatToDelete] = useState(null);
  const [newSeatNumber, setNewSeatNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draggedSeat, setDraggedSeat] = useState(null);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [droppedSeats, setDroppedSeats] = useState([]);
  const [droppedSeats2, setDroppedSeats2] = useState([]);
  const [droppedSeats3, setDroppedSeats3] = useState([]);
  const [droppedSeats4, setDroppedSeats4] = useState([]);
  const [droppedSeats5, setDroppedSeats5] = useState([]);
  const [droppedSeats6, setDroppedSeats6] = useState([]);
  const [droppedSeats7, setDroppedSeats7] = useState([]);
  const [droppedSeats8, setDroppedSeats8] = useState([]);
  const [droppedSeats9, setDroppedSeats9] = useState([]);
  const [droppedSeats10, setDroppedSeats10] = useState([]);
  const [droppedSeats11, setDroppedSeats11] = useState([]);
  const [droppedSeats12, setDroppedSeats12] = useState([]);
  const [droppedSeats13, setDroppedSeats13] = useState([]);
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
  }, [selectedDate]);
  
  const handleSeatClick = (seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat);
      setShowBookingForm(true);
    }
  };

  const handleSeatSelectionForDeletion = (seat) => {
    setSelectedSeatToDelete(seat);
  };

  const handleDeleteSeat = () => {
    if (selectedSeatToDelete) {
      axios
        .delete(`http://localhost:8081/deleteSeat/${selectedSeatToDelete.id}`)
        .then((response) => {
          setSeats(seats.filter((seat) => seat.id !== selectedSeatToDelete.id));
          setSelectedSeatToDelete(null);
        })
        .catch((error) => {
          console.error('Error deleting seat:', error);
        });
    }
  };

  const handleSubmitBooking = () => {
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(selectedDate.getDate() + 1);

    axios
      .put(`http://localhost:8081/updateseat/${selectedSeat.id}`, {
        selectedDate: adjustedDate,
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

  const handleAddSeat = () => {
    axios
      .post('http://localhost:8081/addSeat', {
        seatNumber: newSeatNumber
      })
      .then((response) => {
        console.log('Response from adding seat:', response.data);
        const newSeat = { id: response.data.id, seatnumber: newSeatNumber, status: 'available' };
        setSeats((prevSeats) => [...prevSeats, newSeat]);
        setNewSeatNumber('');
      })
      .catch((error) => {
        console.error('Error adding seat:', error);
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

  const handleDragStart = (e, seat) => {
    setDraggedSeat(seat);
  };

  const handleDragEnter = (e, seat) => {
    e.preventDefault();
    setHoveredSeat(seat);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, seat) => {
    e.preventDefault();
    if (draggedSeat !== seat && draggedSeat.status === 'available' && seat.status === 'available') {
      setSeats((prevSeats) => {
        const updatedSeats = [...prevSeats];
        const draggedIndex = updatedSeats.findIndex((s) => s.id === draggedSeat.id);
        const droppedIndex = updatedSeats.findIndex((s) => s.id === seat.id);
        const temp = updatedSeats[draggedIndex];
        setDroppedSeats(prevSeats => [...prevSeats, draggedSeat]);
        updatedSeats[draggedIndex] = updatedSeats[droppedIndex];
        updatedSeats[droppedIndex] = temp;
        return updatedSeats;
      });
    }
    setDraggedSeat(null);
    setHoveredSeat(null);
  };

  // Function to handle dropping seats into the dropzone
  const handleDropzoneDrop = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      // Check if the dragged seat is already in droppedSeats
      if (!droppedSeats.some(seat => seat.id === draggedSeat.id)) {
        // Add dropped seat to droppedSeats state only if it's not already there
        setDroppedSeats((prevSeats) => [...prevSeats, draggedSeat]);
      }
      // Remove the dragged seat from the seats list
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop2 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      if (!droppedSeats2.some(seat => seat.id === draggedSeat.id)) {
       
        setDroppedSeats2((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop3 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats3.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats3((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop4 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats4.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats4((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop5 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats5.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats5((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop6 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats6.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats6((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop7 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats7.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats7((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop8 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats8.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats8((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop9 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats9.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats9((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop10 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats10.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats10((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop11 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats11.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats11((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop12 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats12.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats12((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };
  const handleDropzoneDrop13 = (e) => {
    e.preventDefault();
    if (draggedSeat && draggedSeat.status === 'available') {
      
      if (!droppedSeats13.some(seat => seat.id === draggedSeat.id)) {
        
        setDroppedSeats13((prevSeats) => [...prevSeats, draggedSeat]);
      }
      
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.id !== draggedSeat.id));
    }
  };

  // Function to handle drag over for the dropzone
  const handleDropzoneDragOver = (e) => {
    e.preventDefault();
  };

  // JSX for the dropzone box
  
const dropzoneBox = (
  <div
    className={Style.dropzone}
    onDrop={handleDropzoneDrop}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-2px', // Adjusted margin
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);

const dropzoneBox2 = (
  <div
    className={Style.dropzone2}
    onDrop={handleDropzoneDrop2}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats2.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox3 = (
  <div
    className={Style.dropzone3}
    onDrop={handleDropzoneDrop3}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats3.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox4 = (
  <div
    className={Style.dropzone4}
    onDrop={handleDropzoneDrop4}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats4.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox5 = (
  <div
    className={Style.dropzone5}
    onDrop={handleDropzoneDrop5}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats5.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox6 = (
  <div
    className={Style.dropzone6}
    onDrop={handleDropzoneDrop6}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats6.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox7 = (
  <div
    className={Style.dropzone7}
    onDrop={handleDropzoneDrop7}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats7.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox8 = (
  <div
    className={Style.dropzone8}
    onDrop={handleDropzoneDrop8}
    onDragOver={handleDropzoneDragOver}
  >
    {droppedSeats8.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox9 = (
  <div
    className={Style.dropzone9}
    onDrop={handleDropzoneDrop9}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats9.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox10 = (
  <div
    className={Style.dropzone10}
    onDrop={handleDropzoneDrop10}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats10.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox11 = (
  <div
    className={Style.dropzone11}
    onDrop={handleDropzoneDrop11}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats11.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox12 = (
  <div
    className={Style.dropzone12}
    onDrop={handleDropzoneDrop12}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats12.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
const dropzoneBox13 = (
  <div
    className={Style.dropzone13}
    onDrop={handleDropzoneDrop13}
    onDragOver={handleDropzoneDragOver}
  >
    
    {/* Render dropped seats */}
    {droppedSeats13.map((seat) => (
    <button
      key={seat.id}
      className={`${Style.seat} ${Style.available}`}
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '35%',
        margin: '5px', // Add margin for spacing
        transition: 'transform 0.3s ease-in-out', // Transition property added
        position: 'relative',
        top: '-10px', // Adjusted margin
        marginLeft: '-1px', // Adjusted margin
        fontSize: '14px'
      }}
      onClick={() => handleSeatClick(seat)}
      draggable
    >
      <p>{seat.seatnumber}</p>
    </button>
  ))}
  </div>
);
  // 
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
              <Link to="/admin" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-house"></i>
                <span className="ms-1">Home</span>
              </Link>
            </li>
            <li className="nav-item text-white fs-4">
              <Link to="/signup" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-person-plus"></i>
                <span className="ms-1">Register new User</span>
              </Link>
            </li>
            <li className="nav-item text-white fs-4">
              <Link to="/databasevis" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-database"></i>
                <span className="ms-2">Database</span>
              </Link>
            </li>
            <li className="nav-item text-white fs-4">
              <Link to="/frontroom" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-calendar"></i>
                <span className="ms-2">Book a seat</span>
              </Link>
            </li>
            <li className="nav-item text-white fs-4">
              <a href="chat" className="nav-link text-white fs-5" aria-current="page">
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
  if (!droppedSeats.some(droppedSeat => droppedSeat.id === seat.id)) {
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
          handleSeatSelectionForDeletion(seat);
        }}
        onDragStart={(e) => handleDragStart(e, seat)}
        onDragEnter={(e) => handleDragEnter(e, seat)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, seat)}
        disabled={seat.status === 'occupied'}
        draggable
      >
        <p>{seat.seatnumber}</p>
      </button>
    );
  } else {
    return null; // Render nothing if the seat is in droppedSeats
  }
})}

          </div>
          {showBookingForm && (
            <div className={Style.deleteButtonContainer}>
              <button className="btn btn-danger" onClick={handleDeleteSeat}>
                Delete Seat
              </button>
            </div>
          )}
          {showBookingForm && (
            <div className={Style.bookingForm}>
              <button onClick={handleSubmitBooking}>Book Seat</button>
            </div>
          )}
          <div className={Style.addSeatContainer}>
            <input
              type="text"
              placeholder="Enter Seat Number"
              value={newSeatNumber}
              onChange={(e) => setNewSeatNumber(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddSeat}>
              Add Seat
            </button>
          </div>

          {/* Include dropzoneBox JSX */}
          {dropzoneBox}
          {dropzoneBox2}
          {dropzoneBox3}
          {dropzoneBox4}
          {dropzoneBox5}
          {dropzoneBox6}
          {dropzoneBox7}
          {dropzoneBox8}
          {dropzoneBox9}
          {dropzoneBox10}
          {dropzoneBox11}
          {dropzoneBox12}
          {dropzoneBox13}
        </div>
      </div>
    </div>
  );
}

export default Frontend;

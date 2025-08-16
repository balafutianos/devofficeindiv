// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';

import { APP_ID, SERVER_SECRET } from './constant';

const Chat = () => {
  // Example room ID for demonstration
  const exampleRoomID = "your_example_room_id";

  // Get the room ID from URL parameters
  const { id } = useParams();
  const roomID = id || exampleRoomID; // Use example room ID if no room ID is provided in URL
  const chatContainerRef = useRef(null);

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
 
  const [avatar, setAvatar] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const [file, setFile] = useState(null);
  

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
    fetchUserData();
  }, []);

  const fetchUserData = () => {
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
  };

  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  useEffect(() => {
    const myMeeting = async () => {
      if (!roomID) {
        console.error('Room ID is empty.');
        return;
      }

      // Generate Kit Token
      const appID = APP_ID;
      const serverSecret = SERVER_SECRET;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        Date.now().toString(),
        "patelmernstack"
      );

      // Create instance object from Kit Token
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Start the call
      zp.joinRoom({
        container: chatContainerRef.current,
        sharedLinks: [
          {
            name: 'Copy link',
            url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
    };

    myMeeting();
  }, [roomID]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
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
              <a href="/chatuser" className="nav-link text-white fs-5" aria-current="page">
                <i className="bi bi-chat"></i>
                <span className="ms-2">Devoffice Meetings</span>
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
              style={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '50px' }}
              className="text-white fs-4 me-2"
              onClick={() => setShowUploadOptions(!showUploadOptions)} // Toggle upload options
            >
              <span style={{ fontSize: '20px' }}>{username}</span>
            </div>
            <div className="avatar-container">
              {avatar && (
                <img
                  src={`http://localhost:8081/images/${avatar}`}
                  alt="Avatar"
                  style={{ width: '47px', height: '47px', borderRadius: '30%', border: '3px solid #f0f0f0', boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)', marginLeft: '-120px' }}
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
        <div className="col">
          {/* Chat Container */}
          <div ref={chatContainerRef} className="chat-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Chat;


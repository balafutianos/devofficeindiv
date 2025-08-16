
// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Email = () => {
  const form = useRef();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setUserEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false); 

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
        setUserEmail(res.data.email);
      })
      .catch((err) => console.log(err));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_oxzjn1a', 'template_et005fs', form.current, {
        publicKey: 'eV42P4OM9_FkxarKS',
        user_email: email,
        user_name: username
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );

    e.target.reset();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
}

  return (
    <section>
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
              <a href="/chat" className="nav-link text-white fs-5" aria-current="page">
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
            
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '50px' }}
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
                  style={{ width: '47px', height: '47px', borderRadius: '30%',border: '3px solid #f0f0f0',boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)', marginLeft: '-120px' }}
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
            <h2 className="text-center">Email Portal</h2>
            <form ref={form} onSubmit={sendEmail} encType="multipart/form-data" className="form-control card-flex-center dir-column">
              <input type="text" value={username} name="user_name" readOnly className="form-control mb-3" />
              <input type="text" placeholder="Subject" name="subject" className="form-control mb-3" />
              <input type="email" placeholder="Recipient Email" name="user_email" required className="form-control mb-3" />
              <input type="email" value={email} placeholder="Email" name="to_email" required className="form-control mb-3" />
              <textarea name="message" cols="30" rows="10" className="form-control mb-3"></textarea>
              
              <div className="text-center">
                <button type="submit" className="btn btn-primary">Send Email</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Email;

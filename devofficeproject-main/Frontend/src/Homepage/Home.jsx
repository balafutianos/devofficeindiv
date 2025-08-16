// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import axios from 'axios';

function Home(){
    //Authentication check
 const handleAuth = () =>{
    console.log("Token:", localStorage.getItem("token")); // Check if token exists in localStorage
    axios.get('http://localhost:8081/checkauth', {
        headers: {
            'access-token': localStorage.getItem("token")
        }
    })
    .then(res => {
        console.log("Response from checkauth:", res);
    })
    .catch(err => {
        console.log("Error in checkauth:", err);
    });
}
handleAuth();

 useEffect(() => {
    axios.get('http://localhost:8081')
      .then(res => {
        if (res.data.role) {
          // Logic to handle role data, if needed
        } else {
          navigator('/login');
        }
      })
      .catch(err => console.log(err))
    },[])

    return(
        <div>
            <h1>Home</h1>
            


        </div>
    )
}

export default Home
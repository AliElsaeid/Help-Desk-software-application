// UserProfile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import avatara1 from '../assets/avatara1.jpg';
// import avatara2 from '../assets/avatara2.jpg';
// import avatara3 from '../assets/avatara3.jpg';
// import avatarb1 from '../assets/avatarb1.jpg';
// import avatarb2 from '../assets/avatarb2.jpg';
// import avatarb3 from '../assets/avatarb3.jpg';
// import avatarc1 from '../assets/avatarc1.jpg';
// import avatarc2 from '../assets/avatarc2.jpg';
// import avatarc3 from '../assets/avatarc3.jpg';


const userbackend = 'http://localhost:3000/api/v1/user';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(['token']);

  const getRandomCharacter = () => {
    const characters = ['a', 'b', 'c'];
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 3) + 1;
  };

  const generateRandomAvatar = () => {
    const randomCharacter = getRandomCharacter();
    const randomNumber = getRandomNumber();
    const imagePath = `../assets/avatar${randomCharacter}${randomNumber}.jpg`;
    console.log('Generated Image Path:', imagePath); // Print to the console
    return imagePath;
  };
  useEffect(() => {
    axios.defaults.withCredentials = true;

    // Fetch user details using the user ID from useParams
    axios
      .get(`${userbackend}/${id}`, { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.error('Error fetching user:', error);
        toast.error('Error fetching user details.');
      });
  }, [id, cookies.token]);

  // Function to generate a random avatar URL
  
  return (
    <div>
      <ToastContainer />

      <div className="user-info-container">
        {user && (
          <div>
          
            <h1>{user.username}</h1>
            <img src={imagePath  } alt="Avatar" />
            <p>{user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

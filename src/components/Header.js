import React, { useContext, useEffect, useState } from 'react';
import './Header.css';
import AuthContext from '../store/app-context';
import { database } from '../firebase'; 
import { ref, get } from 'firebase/database';
import userImage from '../store/user-image.jpg';


const Header = () => {
  const [userName,setUserName] = useState('');
  const authCtx = useContext(AuthContext);
  const logoutHandler=()=>{
    authCtx.logout();
  }

  const fetchData = async () => {
    try {
      const usersRef = ref(database, 'usersMetaData');
      const snapshot = await get(usersRef);
      const userDataArray = [];
  
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userId = childSnapshot.key;
          const userDataSnapshot = childSnapshot.val(); // Get the data snapshot
          const userDataKey = Object.keys(userDataSnapshot)[0]; // Get the first child key
          const userName = userDataSnapshot[userDataKey].userName; // Access the userName
          userDataArray.push({ [userId]: userName });
        });
      }
  
      return { success: true, data: userDataArray };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchData();
        if (response.success) {
          authCtx.usersMetaData(response.data);
        } else {
          console.error('Failed to fetch user data:', response.message);
        }
      } catch (error) {
        console.error('Error: While fetching userMetaDetails:', error.message);
      }
    };

    fetchUserData();
  }, [authCtx.userId]);

  useEffect(()=>{
    const findCurrentUserName = (userDataArray,userId)=>{
      for (const userData of userDataArray) {
        const entry = Object.entries(userData)[0]; // Get the key-value pair
        const foundUserId = entry[0];
        const userName = entry[1];
        if (foundUserId === userId) {
          return userName;
        }
      }
      return null;
    }
  
    if(authCtx.isLoggedIn){
      setUserName(findCurrentUserName(authCtx.metaData,authCtx.userId));
    }
  },[authCtx.metaData]);

  console.log(authCtx.metaData);
  console.log(userName);

  return (
    <div className="header">
      {authCtx.isLoggedIn && (
        <div className='user-details'>
          <img src={userImage} alt='' />
          <p>{userName}</p>
          {/* <p className='show-mini'>({authCtx.userId})</p> */}
        </div>
      )
      }
      <h1>SkinCareXpert</h1>
      {authCtx.isLoggedIn && <button onClick={logoutHandler}>Logout</button> }
    </div>
  )
}

export default Header;

import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  images:[],
  addImage:(newImage)=>{},
  userId:'',
  usersMetaData:()=>{},
  metaData:[]
});

export const AuthContextProvider = (props) => {
  const initialState = localStorage.getItem('token');
  const [token, setToken] = useState(initialState);
  const [images,setImages] = useState([]);
  const [userId,setUserId] = useState(localStorage.getItem('userId'));
  const [metaData,setMetaData] = useState([]);

  const userIsLoggedIn = !!token;

  const loginHandler = (token, inputId) => {
    localStorage.setItem('token', token);
    setToken(token);
    localStorage.setItem('userId', inputId);
    setUserId(inputId);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUserId(null);
    localStorage.removeItem('uploadedImageUrl');
    localStorage.removeItem('uploadedImagePrediction');
  };

  const imageHandler = (newImageData) => {
    const processedImageData = newImageData.map(image => {
      return {
        url: image.url,
        result: image.metadata.customMetadata.prediction,
        time: image.metadata.timeCreated
      };
    });
  
    // Sort the images based on upload time in descending order
    processedImageData.sort((a, b) => {
      return new Date(b.time) - new Date(a.time);
    });
  
    setImages(processedImageData);
  };

  const addMetaHandler = (allUsersMetaData)=>{
    setMetaData(allUsersMetaData);
  }


  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    images:images,
    addImage:imageHandler,
    userId:userId,
    usersMetaData:addMetaHandler,
    metaData:metaData
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
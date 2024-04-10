import React, { useContext,useEffect } from 'react';
import './History.css';
import AuthContext from '../store/app-context';
import { storage } from '../firebase';
import { ref, uploadBytes, listAll, getDownloadURL, getMetadata, updateMetadata } from 'firebase/storage';


function History(props) {
  const imageListRef = ref(storage, `images/${localStorage.getItem('userId')}`);
  const authCtx = useContext(AuthContext);
  console.log("history");
  console.log(authCtx.images);
  
  const fetchImageUrls = () => {
    console.log(imageListRef);
    listAll(imageListRef)
      .then((res) => {
        const promises = res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          return { url, metadata };
        });
        return Promise.all(promises);
      })
      .then((imageData) => {
        authCtx.addImage(imageData); // Update image list in context
        console.log(imageData);
      })
      .catch((error) => {
        console.log(error);
      });  
  };

  useEffect(() => {
    if (authCtx.userId) {
      fetchImageUrls(); // Fetch image URLs when emailEntered is set
    }
  }, [authCtx.userId]);

  return (
    <div className="right-history">
      <h2 className="prediction-title">Prediction History</h2>
      <div className="image-list">
        {authCtx.images.map((image, index) => (
          <div key={index + 1} className="image-item">
            <div className="image-details">

              <img src={image.url} alt="images" className="center-image" />              
              <p className='result'>{image.result}</p>
              <p className='time'>{image.time}</p>
              
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}

export default History;

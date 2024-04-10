import React, { useContext, useEffect, useState } from 'react';
import './UploadImage.css';
import AuthContext from '../store/app-context';
import { storage } from '../firebase';
import { ref, uploadBytes, listAll, getDownloadURL, getMetadata, updateMetadata } from 'firebase/storage';
import { v4 } from 'uuid';

function UploadImage(props) {
  const authCtx = useContext(AuthContext);
  const [imageUpload, setImageUpload] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(localStorage.getItem('uploadedImageUrl'));
  const [result,setResult] = useState(localStorage.getItem('uploadedImagePrediction'));
  const [description,setDescription] = useState('');
  console.log(uploadedImageUrl);
  const imageListRef = ref(storage, `images/${localStorage.getItem('userId')}`);

  const handleImageUpload = (event) => {
    if (imageUpload === null) return;
    console.log(imageUpload);
    const imageRef = ref(storage, `images/${authCtx.userId}/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Image uploaded");
      getDownloadURL(imageRef)
        .then((url) => {
          localStorage.setItem('uploadedImageUrl',url);
          setUploadedImageUrl(url);
          sendImageToBackend(imageUpload, imageRef);
        })
        .catch((error) => {
          console.error("Error getting uploaded image URL:", error);
        });
      // fetchImageUrls();
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });;
  };

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
  console.log(authCtx.images);
  const findDescription = (result)=>{
    if(result === 'Acne'){
      return "Characterized by the formation of pimples, blackheads, whiteheads, and cysts on the skin, particularly on the face, neck, shoulders, and back";
    }else if(result === 'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions'){
      return 'It is a precancerous skin condition caused by prolonged sun exposure, leading to the development of rough, scaly patches on the skin.'
    }else if(result === 'Light Diseases and Disorders of Pigmentation'){
      return 'These conditions encompass a range of disorders affecting skin pigmentation, such as vitiligo, albinism, and melasma .'
    }
    else if(result === 'Ringworm'){
      return 'It is a fungal infection that causes red, scaly, and itchy patches on the skin, often in a ring-shaped pattern.'
    }
    else if(result === 'Warts Molluscum and other Viral Infections'){
      return 'Warts are benign skin growths caused by the human papillomavirus (HPV), appearing as small, rough bumps on the skin surface.'
    }
  }


  const sendImageToBackend = async (imageFile,imageRef) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    console.log(formData);
    try {
      const response = await fetch('http://localhost:5000//predict', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to send image to backend');
      }
  
      const data = await response.json();
      console.log('Prediction:', data.prediction);
      
      setDescription(findDescription(data.prediction))
      const metadata = {
        customMetadata: {
          prediction: data.prediction,
          description: description
        }
      };
      updateMetadata(imageRef, metadata)
        .then(() => {
          console.log("Metadata updated successfully");
          fetchImageUrls();
        })
        .catch((error) => {
          console.error("Error updating metadata:", error);
        });
        localStorage.setItem('uploadedImagePrediction',data.prediction);
        setResult(data.prediction);  

    } catch (error) {
      console.error('Error sending image to backend:', error);
    }
  };
  


  useEffect(() => {
    if (authCtx.userId) {
      fetchImageUrls(); // Fetch image URLs when emailEntered is set
    }
  }, [authCtx.userId]);

  return (
    <div className='info-show'>
      <p>Skin is the largest and fastest growing organ of the body.In this contemporary world, skin diseases are mostly found in humans. A skin disease is a particular kind of illness caused by bacteria or an infection. These diseases like psoriasis have various dangerous effects on the skin and keep on spreading over time.</p>
      <br></br>
      <p>It becomes important to identify these diseases at their initial stage to control it from spreading. Since there are large number of different skin diseases, manually identifying them can be a difficult task. Derma disease detection and classification can help in early identification of disease, prevent it from becoming chronic.</p>
      <br></br>
      <p>The following Derma Diseases are identified by our virtual doctor:</p>
      <ul>
        <li>Acne</li>
        <li>Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions</li>
        <li>Light Diseases and Disorders of Pigmentation</li>
        <li>Ringworm</li>
        <li>Warts Molluscum and other Viral Infections</li>
      </ul>
      <div className="container">
        <div className="upload">
          <h2>Upload Image</h2>
          <div className="file">
            <input type="file" accept="image/*" className="custom-file-input" onChange={(event) => { setImageUpload(event.target.files[0]); }} />
            <div>
              <button onClick={handleImageUpload}>Submit</button>
            </div>
          </div>
        </div>
        {uploadedImageUrl && (
          <div className="image-preview">
            <h2>Uploaded Image Preview</h2>
            <img src={uploadedImageUrl} alt="Uploaded" />
            {result !== '' && <p>Predicted Output: {result}</p>}
            {description !== '' && <p style={{fontWeight:"normal"}}>{description}</p>}
            <p>To know more use our skin care assistant at bottom right.</p>
          </div>
        )}
      </div>
      <div className='note'>
        <p>&diams; Please note that although our model achieves an accuracy rate of 82%, its predictions should be considered with a limited guarantee.</p>
        <p>Determining the  precise type of skin lesion should be done by a qualified doctor for an accurate diagnosis.</p>
      </div>
    </div>
  );
}

export default UploadImage;


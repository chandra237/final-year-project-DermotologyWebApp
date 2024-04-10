import React, { useState,useRef, useContext } from 'react';
import './LoginForm.css'; // Import your CSS file
import AuthContext from '../store/app-context';
import { database } from '../firebase'; 
import { ref, push} from 'firebase/database';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const userNameInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);


  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  // const email = '';
  const submitHandler = (event) =>{
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredpassword = passwordInputRef.current.value;
    const eneteredUserName = !isLogin?userNameInputRef.current.value:0;
    const enteredconfirmpassword = !isLogin?confirmPasswordInputRef.current.value : 0;
    if(enteredconfirmpassword !== 0 && enteredconfirmpassword !== enteredpassword){
      alert('Please make sure your passwords match.');
      return;
    }
    let url='';
    if(isLogin){
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAA_zG1w4q5vN453iR_bZs5OYO2z0u96f8"
    }else{
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAA_zG1w4q5vN453iR_bZs5OYO2z0u96f8"
    }

    fetch(url,{
      method:'POST',
      body:JSON.stringify({
        email:enteredEmail,
        password:enteredpassword,
        returnSecureToken:true
      }),
      headers:{
        'content-type' : 'application/json'
      }
    }).then(res =>{
      // setIsLoading(false);
      if(res.ok){
        return res.json();
      }else{
        return res.json().then(data =>{
          throw new Error(data.error.message);
        })
      }
    })
    .then(data => {
      authCtx.login(data.idToken,data.localId); 
      // authCtx.maill(enteredEmail);
      console.log(data.localId);
      console.log(data.idToken);
      // Navigate('/');
      if(eneteredUserName !== 0){
        sendMetaData(data.localId,eneteredUserName);
      }
      
    })
    .catch(err => {
      alert(err.message);
    });
    
  }

  const sendMetaData= (currUserId,currUserName)=>{
    try{
      const questionRef = push(ref(database, `usersMetaData/${currUserId}`), {
        userName:currUserName
    });
    }
    catch(error){
      console.log("Error: when sending user metadata:",error.message);
    }
  }

  return (
    <div className="login-form-container">
      
      <form className="login-form" onSubmit={submitHandler}>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

        <div className="form-group">
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>

        <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>

        {!isLogin && 
            <div className="form-group">
            <label htmlFor='pass'>confirm Password</label>
            <input type='password' id='pass' required ref={confirmPasswordInputRef}/>
            </div>
        }

        {!isLogin && 
            <div className="form-group">
            <label htmlFor='username'>User name</label>
            <input type='text' id='username' required ref={userNameInputRef}/>
            </div>
        }

        <div className="actions">
          <button>{isLogin ? 'Login' : 'Create Account'}</button> 
          {/* <p>Please wait while we create you account..!</p> */}
          <button
            type='button'
            className="toggle"
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default LoginForm;


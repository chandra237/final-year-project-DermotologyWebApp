import React,{useContext}from 'react';
import Menu from './components/Menu';
import UploadImage from './components/UploadImage';
import History from './components/History';
import './index.css';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import AuthContext from './store/app-context';
import AskQuestion from './components/AskQuestion';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  console.log("Email retrieved from localStorage:", authCtx.userId);

  return (
    <>
      <Header />
      {!isLoggedIn && <LoginForm />}
      {isLoggedIn && (
        <div className="app">
          <div className="menu">
            <Menu />
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<UploadImage />} />
              <Route path="/prediction-history" element={<History />} />
              <Route path="/community" element={<AskQuestion />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

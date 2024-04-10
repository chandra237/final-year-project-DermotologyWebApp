import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './store/app-context';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <AuthContextProvider>
    <Router>  
      <App />   
    </Router>
  </AuthContextProvider>,
  document.getElementById('root')
);

import React from 'react'
import './Menu.css';
import {NavLink} from 'react-router-dom';

const Menu = () => {

 
  (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        window.voiceflow.chat.load({
          verify: { projectID: '65f80060744f38c8b9fbfa7c' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production'
        });
      }
      v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
  })(document, 'script');

  return (
    <div class="sidebar">
      <h2>Menu</h2>
      <ul class="inner-menu">
        <li>
          <NavLink to='/home' style={{textDecoration:"none"}} activeclassname='active'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/prediction-history' style={{textDecoration:"none"}} activeclassname='active'>Prediction History</NavLink>
        </li>
        <li>
          <NavLink to='/community'style={{textDecoration:"none"}} activeclassname='active'>Community</NavLink>
        </li>
      </ul>
    </div>

  )
}

export default Menu

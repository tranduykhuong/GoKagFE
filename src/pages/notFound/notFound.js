import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.scss';

const NotFound = () => (
  // <div style={{ overflow: 'hidden', maxWidth: '100vw', maxHeight: '100vh' }}>
  <div className="bg-cloud">
    <div id="clouds">
      <div className="cloud x1" />
      <div className="cloud x1_5" />
      <div className="cloud x2" />
      <div className="cloud x3" />
      <div className="cloud x4" />
      <div className="cloud x5" />
    </div>
    <div className="c">
      <div className="_404">404</div>
      <hr />
      <div className="_1">THE PAGE</div>
      <div className="_2">WAS NOT FOUND</div>
      <Link to="/" class="btn">
        Back to Home
      </Link>
    </div>
  </div>
  // </div>
);

export default NotFound;

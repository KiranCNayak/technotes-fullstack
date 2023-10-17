import React from 'react';

import { Link } from 'react-router-dom';

const Public = () => {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh ',
      }}>
      <div>
        <header>
          <h1>
            Welcome to <span className="nowrap">KCN Repairs!</span>
          </h1>
        </header>
        <hr />
      </div>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        className="public__main">
        <p>Located in Bengaluru for any repair needs.</p>
        <address className="public__addr">
          KCN Repairs
          <br />
          2128, KCN Layout
          <br />
          Bengaluru, 560085
        </address>
        <p>Owner: Kiran C Nayak</p>
      </main>
      <div>
        <hr />
        <footer>
          <Link to={'/login'}>Employee Login</Link>
        </footer>
      </div>
    </section>
  );
};

export default Public;

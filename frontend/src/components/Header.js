import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <h1>Ephemeral Observer</h1>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/create">Create Event</Link>
    </nav>
  </header>
);

export default Header;

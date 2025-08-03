import React from 'react';
import { Link } from 'react-router-dom';
// import { Button } from './style.ts';
import './header.css';

export const Header: React.FC = () => (
    <header>
        <div className="storybook-header">
            <div className="header-left">
                <h1>U.S. Philatelic Classics Society</h1>
            </div>
            <nav className="header-nav">
                <Link to="/">Home</Link>
                <Link to="/search">Search</Link>
                <Link to="/ticket">Ticket</Link>
                <Link to="/info">Info</Link>
                <Link to="/login">Login</Link>
            </nav>
            {/*<div className="header-right">*/}
            {/*    <Button size="small" label="Contact Us" />*/}
            {/*    <Button size="small" label="Log In" />*/}
            {/*</div>*/}
        </div>
    </header>
);

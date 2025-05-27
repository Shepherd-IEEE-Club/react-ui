import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button.ts';
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
                <Link to="/info">Info</Link>
            </nav>
            <div className="header-right">
                <Button size="small" label="Contact Us" />
                <Button size="small" label="Log In" />
            </div>
        </div>
    </header>
);

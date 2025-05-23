import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import SearchableList from "./pages/search";
import { Header } from "./pages/Header";
import LandingPage from "./pages/landing";
import InfoPage from "./pages/info";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  body {
    font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #f9f9f9;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    overflow-y: scroll;
`;

const NavBar = styled.nav`
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 10px;
    //background: #007bff;
`;

const NavLink = styled(Link)`
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
`;

// FIXME nav fucked up header
const App: React.FC = () => {
    return (
        <Router>
            <GlobalStyle />
            <Page>
                <Header />
                <Container>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/search" element={<SearchableList />} />
                        <Route path="/info" element={<InfoPage />} />
                    </Routes>
                </Container>
            </Page>
        </Router>
    );
};

export default App;

// App.tsx
import React from "react";
import SearchableList from "./pages/search";
import { Header } from './pages/Header';
import styled from "styled-components";

import { createGlobalStyle } from 'styled-components';
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
    height: 100vh; /* Ensure the page fills the viewport */
`;

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    overflow-y: scroll;
`;

const App: React.FC = () => {
    return (
        <Page>
            <GlobalStyle />
            <Header />
            <Container>
                <SearchableList />
            </Container>
        </Page>
    );
};

export default App;

import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import styled, {createGlobalStyle} from "styled-components";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {httpBatchLink, loggerLink} from "@trpc/client";


import SearchableList from "@woco/web/pages/Search/index.tsx";
import {Header} from "@woco/web/pages/Header.tsx";
import LandingPage from "@woco/web/pages/landing.tsx";
import InfoPage from "@woco/web/pages/info.tsx";
import {trpc} from "@woco/web/trpc.ts";
import superjson from "superjson";
import TicketsPage from "@woco/web/pages/Ticket";
import {ModalManagerWrapper} from "@woco/web/pages/ModalManager.tsx";
import {TableContext} from './context/TableContext';
import {TableProvider} from "@woco/web/context/TableProvider.tsx";
/* ───────────────────────  styling  ─────────────────────── */

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
    overflow-y: auto;

    > * {
        width: 100%;
        max-width: 80vw;
        padding: 1rem;
        box-sizing: border-box;
    }
`;


/* ────────────────────  tRPC / React-Query  ──────────────────── */
export default function App() {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                loggerLink({enabled: () => true}), // 👈 this must log
                httpBatchLink({
                    url: 'http://localhost:3001/trpc',
                    transformer: superjson,
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>

                <Router>
                    <GlobalStyle/>
                    <TableProvider>
                        <Page>
                            <Header/>
                            <Container>
                                <Routes>
                                    <Route path="/" element={<LandingPage/>}/>
                                    <Route path="/search" element={<SearchableList/>}/>
                                    <Route path="/ticket" element={<TicketsPage/>}/>
                                    <Route path="/info" element={<InfoPage/>}/>
                                </Routes>
                            </Container>

                            <ModalManagerWrapper/>
                        </Page>
                    </TableProvider>
                </Router>
            </QueryClientProvider>
        </trpc.Provider>
    )
}


//  FIXME implement modalhost where all modals live and can stack up, (search page lags atm)
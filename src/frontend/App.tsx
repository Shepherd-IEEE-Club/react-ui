import React from "react";
import SearchableList from "./pages/search"
import { Header } from './pages/Header';


const App: React.FC = () => {
    return (
        <>
        <Header/>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <SearchableList />
        </div>
        </>
    );
};

export default App;

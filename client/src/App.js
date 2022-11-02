import "./App.css";
import { Routes, Route } from "react-router-dom";
import Search from "./components/Search";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Upload from "./components/Upload";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/upload" element={<Upload />} />
            </Routes>
        </>
    );
}

export default App;

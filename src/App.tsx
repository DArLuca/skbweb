import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Meisterschaft from "./pages/Meisterschaft";
import TournamentPage from "./pages/TournamentPage";
import ArticlePage from "./pages/ArticlePage";
import NewsArchive from "./pages/NewsArchive";
import NewsArticlePage from "./pages/NewsArticlePage";
import "./App.css";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/meisterschaft" element={<Meisterschaft />} />
                <Route path="/meisterschaft/:tournament" element={<TournamentPage />} />
                <Route path="/meisterschaft/:tournament/:year/:slug" element={<ArticlePage />} />
                <Route path="/news" element={<NewsArchive />} />
                <Route path="/news/:year/:slug" element={<NewsArticlePage />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;

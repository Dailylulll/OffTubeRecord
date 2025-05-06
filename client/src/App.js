import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoDetail from './pages/VideoDetail';
import SearchResults from './pages/SearchResults';  // new search results page
import HistoryVideos from './pages/HistoryVideos';
import HistoryComments from './pages/HistoryComments';

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />  {/* search route */}
          <Route path="/history/videos" element={<HistoryVideos />} />
          <Route path="/history/comments" element={<HistoryComments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/videos/:videoId" element={<VideoDetail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

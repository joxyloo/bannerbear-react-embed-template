import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import UploadPage from './pages/UploadPage/UploadPage';

function App() {
  return (
    <Router>
      <div>
        <div className='App'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/upload' element={<UploadPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

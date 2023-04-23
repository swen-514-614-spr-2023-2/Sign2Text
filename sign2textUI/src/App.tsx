import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import Rooms from './pages/Rooms';
import Create from './pages/Create';
import Als from './pages/Als';
import NonAls from './pages/NonAsl';
import Navbar from './components/Navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { themeTut } from "./utils/styles";

function App() {

  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={themeTut}>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/createRoom" element={<Create />} />
            <Route path="/AlsView/:roomid" element={<Als />} />
            <Route path="/NonAlsView/:roomid" element={<NonAls />} />
            <Route path='*' element={<NotFound />} />
          </Routes>

          <Footer />
        </ThemeProvider>
      </Router>

    </div>
  )
}

export default App

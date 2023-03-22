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



function App() {

  return (
    <div className="App">
      <Router>

        <Navbar/>

        <Routes>
          <Route  path="/" element={<Home/>}/>
          <Route  path="/rooms" element={<Rooms/>}/>
          <Route  path="/createRoom" element={<Create/>}/>
          <Route  path="/AlsView" element={<Als/>}/>
          <Route  path="/NonAlsView" element={<NonAls/>}/>
          {/* <Route  path="/AlsView/:id" element={<ProjectDisplay/>}/> */}
          <Route path='*' element={<NotFound />} />
        </Routes>

        <Footer/>

      </Router>

    </div>
  )
}

export default App

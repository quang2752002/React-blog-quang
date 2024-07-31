import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ListBlog from './pages/ListBlog';
import About from './pages/About';
import CreateBlog from './pages/CreateBlog';
import UpdateBlog from './pages/UpdateBlog';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<ListBlog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/create" element={<CreateBlog />} />
                    <Route path="/update/:id" element={<UpdateBlog />} />


                </Routes>
            </div>
        </Router>
    );
}

export default App;

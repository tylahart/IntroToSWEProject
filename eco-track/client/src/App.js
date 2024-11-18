import React from 'react';
import WasteForm from './components/WasteForm'; // Adjust path if necessary
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/login">Logout</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Login />} />  {/* Default route set to Login */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/wasteform" element={<WasteForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
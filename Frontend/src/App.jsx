import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExamPage from './pages/Exam';
// import MathematicsExam from './pages/exams/MathematicsExam';
// import ScienceExam from './pages/exams/ScienceExam';
// import EnglishExam from './pages/exams/EnglishExam';
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Testimonial from './pages/Testimonial';
import Pricing from './pages/Pricing';
import Test from './pages/Test';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import About from './pages/About';
import CreateTest from './pages/CreateTest';
import Result from './pages/Result';
import Error from './pages/Error';
import ProtectedRoute from './components/ProtectedRoute';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ForgotPasswordCard from './components/ForgotPasswordCard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';






function App() {
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Set the fullName from token data
        if (decoded.role === 'student') {
          setIsTeacher(false);
        } else {
          setIsTeacher(true);
        }
      } catch (error) {
        setIsTeacher(false);
        console.error("Token decode error:", error);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exam" element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            } />
            <Route path='/testimonial' element={<Testimonial />} />
            <Route path='/pricing' element={<Pricing />} />
            <Route path='/test' element={
              <ProtectedRoute>
                <Test />
              </ProtectedRoute>
            } />
            <Route path='/signin' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/about' element={<About />} />
            <Route path='/create-test' element={
              <ProtectedRoute requiredRole="teacher">
                <CreateTest />
              </ProtectedRoute>
            } />
            <Route path='/results' element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            } />
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path='/edit' element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path='/error' element={<Error />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

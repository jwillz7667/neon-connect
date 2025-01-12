import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ProfilePage from './pages/ProfilePage';
import MembershipPage from './pages/MembershipPage';
import ProviderOnboarding from './pages/ProviderOnboarding';
import ProfileEdit from './pages/ProfileEdit';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow mt-20">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/provider-onboarding" element={<ProviderOnboarding />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
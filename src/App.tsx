import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ProfilePage from './pages/ProfilePage';
import MembershipPage from './pages/MembershipPage';
import ProfileEdit from './pages/ProfileEdit';
import ProviderOnboarding from './pages/ProviderOnboarding';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import SafetyPage from './pages/SafetyPage';
import TermsPage from './pages/TermsPage';
import HelpPage from './pages/HelpPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import CategoriesPage from './pages/CategoriesPage';
import FeaturedPage from './pages/FeaturedPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AgeDisclaimer from './components/AgeDisclaimer';
import FaceDetectionTest from './components/verification/FaceDetectionTest';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/provider-onboarding" element={<ProviderOnboarding />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/featured" element={<FeaturedPage />} />
            <Route path="/face-detection-test" element={<FaceDetectionTest />} />
          </Routes>
        </main>
        <Footer />
        <AgeDisclaimer />
      </div>
    </Router>
  );
};

export default App;

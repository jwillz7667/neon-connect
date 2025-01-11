import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 glass-card backdrop-blur-md py-4 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h3 className="text-primary font-semibold mb-2">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/safety" className="text-white/70 hover:text-primary transition-colors">Safety Tips</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary font-semibold mb-2">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-white/70 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-white/70 hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary font-semibold mb-2">Follow Us</h3>
            <ul className="space-y-2">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center text-white/50 text-sm">
          © 2024 NeonConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
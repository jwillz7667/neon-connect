import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="glass-card backdrop-blur-md py-2 md:py-4 px-4 md:px-6 text-sm md:text-base">
      <div className="container mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 text-center">
          <div>
            <h3 className="text-primary font-semibold mb-1 md:mb-2 text-xs md:text-base">About</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/about" className="text-white/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/safety" className="text-white/70 hover:text-primary transition-colors">Safety</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-primary transition-colors">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary font-semibold mb-1 md:mb-2 text-xs md:text-base">Support</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/help" className="text-white/70 hover:text-primary transition-colors">Help</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-white/70 hover:text-primary transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary font-semibold mb-1 md:mb-2 text-xs md:text-base">Follow Us</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-2 md:mt-6 text-center text-white/50 text-xs md:text-sm">
          <p className="text-sm text-gray-400">
            © 2024 NeonMeet.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

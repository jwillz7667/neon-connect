import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t-2 border-[#FF00FF] mt-auto relative">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: '0 -4px 20px -2px rgba(255, 0, 255, 0.3)',
          zIndex: 0
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 text-center py-6">
          <div>
            <h3 className="text-[#FF00FF] font-semibold mb-1 md:mb-2 text-xs md:text-base">About</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/about" className="text-white/70 hover:text-[#FF00FF] transition-colors">About Us</Link></li>
              <li><Link to="/safety" className="text-white/70 hover:text-[#FF00FF] transition-colors">Safety</Link></li>
              <li><Link to="/terms" className="text-white/70 hover:text-[#FF00FF] transition-colors">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#FF00FF] font-semibold mb-1 md:mb-2 text-xs md:text-base">Support</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/help" className="text-white/70 hover:text-[#FF00FF] transition-colors">Help</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-[#FF00FF] transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-white/70 hover:text-[#FF00FF] transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#FF00FF] font-semibold mb-1 md:mb-2 text-xs md:text-base">Follow Us</h3>
            <ul className="space-y-1 md:space-y-2">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#FF00FF] transition-colors">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#FF00FF] transition-colors">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#FF00FF] transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-2 md:mt-6 text-center pb-6">
          <p className="text-sm text-white/50">
            © 2024 NeonMeet.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

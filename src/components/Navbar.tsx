import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <img 
            src="/images/lively-logo.jpg" 
            alt="LivelyLightingCo Logo" 
            className="h-12 w-auto"
          />
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className={`text-sm font-medium hover:text-indigo-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Features</a>
          <a href="#difference" className={`text-sm font-medium hover:text-indigo-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Why Choose Us</a>
          <a href="#process" className={`text-sm font-medium hover:text-indigo-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Our Process</a>
          <a href="#gallery" className={`text-sm font-medium hover:text-indigo-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Gallery</a>
          <a href="#contact" className={`px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg`}>
            Book Now
          </a>
        </div>
        
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 
            <X className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} /> : 
            <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
          }
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md">
          <div className="px-6 py-4 space-y-3">
            <a href="#features" className="block text-gray-700 hover:text-indigo-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#difference" className="block text-gray-700 hover:text-indigo-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Why Choose Us</a>
            <a href="#process" className="block text-gray-700 hover:text-indigo-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Our Process</a>
            <a href="#gallery" className="block text-gray-700 hover:text-indigo-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Gallery</a>
            <a href="#contact" className="block px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg w-full text-center" onClick={() => setIsMenuOpen(false)}>
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
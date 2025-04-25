import React from 'react';
import { Lightbulb, Facebook, Instagram, Youtube, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Lightbulb className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">LivelyLightingCo</span>
            </div>
            <p className="text-gray-400 mb-6">
              Professional permanent lighting installation for homes in the greater Austin area.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/livelylightingco" aria-label="Visit our Facebook page" rel="noopener noreferrer" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/livelylightingco" aria-label="Follow us on Instagram" rel="noopener noreferrer" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/@livelylightingco" aria-label="Subscribe to our YouTube channel" rel="noopener noreferrer" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="mailto:contact@livelylightingco.com" aria-label="Email us" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#difference" className="text-gray-400 hover:text-white transition-colors">Why Choose Us</a></li>
              <li><a href="#process" className="text-gray-400 hover:text-white transition-colors">Our Process</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Residential Lighting</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Govee Installation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Holiday Lighting</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accent Lighting</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Smart Home Integration</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <strong className="text-white">Phone:</strong> (512) 555-1234
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Email:</strong> info@livelylightingco.com
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Hours:</strong> Mon-Fri: 9am-6pm
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Service Area:</strong> Austin, TX and surrounding areas
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LivelyLightingCo. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
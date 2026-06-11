import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              DineFlow
            </h3>
            <p className="text-gray-400">Delivering happiness to your doorstep since 2026</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/restaurants" className="hover:text-primary transition">Restaurants</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition">My Orders</Link></li>
              <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/faq" className="hover:text-primary transition">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition"><Facebook /></a>
              <a href="#" className="hover:text-primary transition"><Twitter /></a>
              <a href="#" className="hover:text-primary transition"><Instagram /></a>
              <a href="#" className="hover:text-primary transition"><Github /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 DineFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
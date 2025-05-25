
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Only scroll on home page
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/', action: () => scrollToSection('home') },
    { name: 'About', href: '/#about', action: () => scrollToSection('about') },
    { name: 'Skills', href: '/#skills', action: () => scrollToSection('skills') },
    { name: 'Projects', href: '/#projects', action: () => scrollToSection('projects') },
    { name: 'Experience', href: '/#experience', action: () => scrollToSection('experience') },
    { name: 'Blog', href: '/blog', action: null },
    { name: 'Contact', href: '/#contact', action: () => scrollToSection('contact') },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gradient">
            Flutter<span className="text-flutter-teal">Dev</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action || (() => {})}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-flutter-blue transition-colors cursor-pointer"
              >
                {link.action ? (
                  <span>{link.name}</span>
                ) : (
                  <Link to={link.href}>{link.name}</Link>
                )}
              </button>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 ml-3 text-foreground"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md py-4 px-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action || (() => {})}
                className="px-4 py-2 text-foreground/80 hover:text-flutter-blue transition-colors text-left"
              >
                {link.action ? (
                  <span>{link.name}</span>
                ) : (
                  <Link to={link.href} onClick={() => setIsMenuOpen(false)}>{link.name}</Link>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

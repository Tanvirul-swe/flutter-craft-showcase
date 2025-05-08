
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin } from 'lucide-react';

const HeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Crafting pixel-perfect cross-platform apps in Flutter";
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setTypedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(typing);
    }, 100);
    
    return () => clearInterval(typing);
  }, []);

  return (
    <section 
      id="home" 
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(230, 251, 255, 0.8) 0%, rgba(4, 104, 215, 0.1) 100%)'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-64 h-64 rounded-full bg-flutter-teal/10 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-flutter-blue/10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-flutter-teal/10 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 z-10">
        <div className="max-w-3xl">
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Flutter App <span className="text-gradient">Developer</span>
            </h1>
            
            <div className="h-12">
              <h2 className="text-xl md:text-2xl font-medium text-foreground/80">
                {typedText}
                <span className="animate-blink">|</span>
              </h2>
            </div>
            
            <p className="text-lg text-foreground/70 max-w-2xl">
              With 3 years of experience building beautiful, responsive, and high-performance 
              mobile applications for iOS and Android with Flutter.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-flutter-blue hover:bg-flutter-blue/90">
                <Download className="mr-2 h-4 w-4" /> Download CV
              </Button>
              <Button size="lg" variant="outline">
                View Projects
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                <Github size={20} />
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                <Linkedin size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-foreground/70" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

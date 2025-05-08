
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-background" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-16 h-1 bg-flutter-blue mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-flutter-blue/20 to-flutter-teal/20 rounded-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-flutter-blue/30">
                Profile Image
              </div>
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-flutter-teal/10 rounded-lg"></div>
              <div className="absolute -top-4 -left-4 w-40 h-40 bg-flutter-blue/10 rounded-lg"></div>
            </div>
          </div>

          <div className="reveal">
            <h3 className="text-2xl font-bold mb-4">Flutter App Developer</h3>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Hello! I'm a passionate Flutter developer with 3 years of experience in building 
              cross-platform mobile applications. My journey in mobile development started with
              native Android development, but I quickly fell in love with Flutter's capabilities
              and haven't looked back since.
            </p>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              I specialize in creating beautiful, responsive, and high-performance applications
              that work flawlessly on both iOS and Android. My approach combines clean architecture
              principles with an eye for detail in UI/UX design.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p><span className="font-semibold">Name:</span> John Developer</p>
                <p><span className="font-semibold">Experience:</span> 3 Years</p>
              </div>
              <div>
                <p><span className="font-semibold">Email:</span> hello@flutterdev.com</p>
                <p><span className="font-semibold">Location:</span> Dhaka, Bangladesh</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-flutter-blue hover:bg-flutter-blue/90">
                Download CV
              </Button>
              <Button variant="outline">
                Contact Me
              </Button>
            </div>
          </div>
        </div>

        {/* Certifications & Achievements */}
        <div className="mt-20 reveal">
          <h3 className="text-2xl font-bold mb-6 text-center">Certifications & Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Flutter Certified Developer",
                issuer: "Google",
                year: "2022",
              },
              {
                title: "Mobile App Development Expert",
                issuer: "Udemy",
                year: "2021",
              },
              {
                title: "UI/UX Design Fundamentals",
                issuer: "Design Academy",
                year: "2020",
              },
            ].map((cert, index) => (
              <div 
                key={index} 
                className="glass-card p-6 transition-all hover:shadow-lg hover:scale-105 duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-flutter-blue/10 flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-flutter-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-center">{cert.title}</h4>
                <p className="text-foreground/70 text-center">{cert.issuer} • {cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

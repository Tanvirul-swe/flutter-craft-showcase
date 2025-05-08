
import React, { useEffect } from 'react';

type Skill = {
  name: string;
  level: number;
  category: 'Languages' | 'Frameworks & Libraries' | 'Tools';
};

const SkillsSection = () => {
  const skills: Skill[] = [
    { name: 'Dart', level: 95, category: 'Languages' },
    { name: 'Go', level: 85, category: 'Languages' },
    { name: 'Java', level: 90, category: 'Languages' },
    { name: 'Swift', level: 80, category: 'Languages' },

    { name: 'Flutter', level: 95, category: 'Frameworks & Libraries' },
    { name: 'Flutter Bloc', level: 80, category: 'Frameworks & Libraries' },
    { name: 'Firebase', level: 90, category: 'Frameworks & Libraries' },
    { name: 'Gin (Go)', level: 75, category: 'Frameworks & Libraries' },
    // { name: 'React Native', level: 75, category: 'Frameworks & Libraries' },

    { name: 'Figma', level: 85, category: 'Tools' },
    { name: 'Git', level: 90, category: 'Tools' },
    { name: 'VS Code', level: 95, category: 'Tools' },
    { name: 'Postman', level: 80, category: 'Tools' },
  ];

  const categories = ['Languages', 'Frameworks & Libraries', 'Tools'];

  useEffect(() => {
    // Animation for skill bars
    const skillBars = document.querySelectorAll('.skill-bar');
    setTimeout(() => {
      skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        (bar as HTMLElement).style.width = `${level}%`;
      });
    }, 300);

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
    <section id="skills" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            I've worked with a variety of technologies to develop robust and scalable applications.
            Here are my areas of expertise:
          </p>
          <div className="w-16 h-1 bg-flutter-blue mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {categories.map((category) => (
            <div key={category} className="reveal">
              <div className="bg-white dark:bg-flutter-dark/20 p-6 rounded-lg shadow-md h-full">
                <h3 className="text-xl font-bold mb-6 text-gradient">{category}</h3>
                <div className="space-y-6">
                  {skills
                    .filter(skill => skill.category === category)
                    .map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="skill-bar h-2 rounded-full bg-gradient-to-r from-flutter-blue to-flutter-teal transition-all duration-1000 ease-out"
                            data-level={skill.level}
                            style={{ width: "0%" }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Skills */}
        <div className="mt-16 max-w-3xl mx-auto reveal">
          <h3 className="text-xl font-bold mb-6 text-center">Additional Skills & Knowledge</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["State Management", "RESTful APIs", "GraphQL", "UI/UX Design",
              "CI/CD", "Test-Driven Development", "Clean Architecture", "BLoC Pattern",
              "Provider", "GetX", "Firebase Auth", "SQLite", "Responsive Design", "Animations",
              "Google Maps API", "In-App Purchases", "Push Notifications"]
              .map((skill, index) => (
                <span
                  key={index}
                  className="bg-white dark:bg-flutter-dark/30 text-foreground/80 py-2 px-4 rounded-full text-sm shadow-sm"
                >
                  {skill}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

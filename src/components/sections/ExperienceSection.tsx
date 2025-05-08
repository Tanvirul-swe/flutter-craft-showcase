
import React from 'react';

type ExperienceItem = {
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies: string[];
};

const ExperienceSection = () => {
  const experiences: ExperienceItem[] = [
    {
      company: "Tech Innovators",
      position: "Senior Flutter Developer",
      duration: "2022 - Present",
      description: "Leading a team of mobile developers, architecting and developing complex Flutter applications. Implemented advanced state management solutions and optimized app performance.",
      technologies: ["Flutter", "Firebase", "RESTful APIs", "GetX", "BLoC"],
    },
    {
      company: "Mobile Solutions Inc",
      position: "Flutter Developer",
      duration: "2020 - 2022",
      description: "Developed and maintained multiple Flutter applications with seamless integration of third-party services. Collaborated with designers to implement pixel-perfect UI.",
      technologies: ["Flutter", "Provider", "SQLite", "Google Maps API"],
    },
    {
      company: "App Factory",
      position: "Junior Mobile Developer",
      duration: "2019 - 2020",
      description: "Started with Android native development and transitioned to Flutter. Created UI components and implemented basic app functionality.",
      technologies: ["Flutter", "Android", "Java", "Dart"],
    },
  ];

  return (
    <section id="experience" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            My professional journey as a Flutter developer.
          </p>
          <div className="w-16 h-1 bg-flutter-blue mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-flutter-blue/20 rounded"></div>
            
            {/* Experience items */}
            {experiences.map((exp, index) => (
              <div key={index} className="relative mb-16 reveal">
                <div className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-flutter-blue z-10"></div>
                  
                  {/* Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="bg-white dark:bg-flutter-dark/20 p-6 rounded-lg shadow-md">
                      <div className="flex flex-wrap justify-between items-center mb-3">
                        <h3 className="text-xl font-bold">{exp.position}</h3>
                        <span className="text-sm bg-flutter-blue/10 text-flutter-blue px-3 py-1 rounded-full">
                          {exp.duration}
                        </span>
                      </div>
                      <h4 className="text-lg font-medium mb-3">{exp.company}</h4>
                      <p className="text-foreground/70 mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Empty div for layout on mobile */}
                  <div className="md:w-1/2 mb-6 md:mb-0"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client logos */}
        <div className="mt-20">
          <h3 className="text-xl font-bold mb-8 text-center">Clients & Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white dark:bg-flutter-dark/30 w-32 h-32 rounded-lg flex items-center justify-center shadow-sm">
                <div className="text-2xl text-flutter-blue/30 font-bold">LOGO {index}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

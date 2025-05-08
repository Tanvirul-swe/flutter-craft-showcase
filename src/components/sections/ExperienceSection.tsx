
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
      company: "iPAGE Global Inc",
      position: "Software Engineer",
      duration: "March 2022 – Present",
      description: "Leading the development of robust cross-platform mobile applications using Flutter. Architecting scalable solutions, implementing clean architecture, and optimizing performance for production-ready apps. Collaborating across teams to ensure seamless UI/UX delivery and API integration.",
      technologies: ["Flutter", "Firebase", "RESTful APIs", "GetX", "BLoC · Clean Architecture", "GraphQL", "SQLite"],
    },
    {
      company: "Anun Limited",
      position: "Senior Software Engineer",
      duration: "Feb 2022 – Jun 2022",
      description: "Contributed to core app modules in a part-time capacity, building high-quality features and optimizing existing functionalities. Enhanced user experience by improving state handling and performance bottlenecks.",
      technologies: ["Flutter", "SQLite", "Google Maps API", " Firebase", "RESTful APIs", "GetX"],
    },
    {
      company: "ICT Division (Govt. of Bangladesh)",
      position: "Flutter App Developer",
      duration: "Nov 2021 – Feb 2022",
      description: "Worked on government digital service apps, focusing on mobile solutions for citizens. Built and maintained mobile apps with clean UIs and ensured stability across platforms. Collaborated with cross-functional teams to meet public sector standards.",
      technologies: ["Flutter", "Firebase", "RESTful APIs ", "State Management"],
    },
    {
      company: "NapTech Labs",
      position: "App Developer Intern",
      duration: "Apr 2021 – Sep 2021",
      description: "Supported the mobile app team in developing UI components, integrating APIs, and testing app performance. Gained solid foundational experience in Flutter, native Android development, and agile methodologies.",
      technologies: ["Flutter", "Android", "Java", "Dart", "Git"],
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
                <img
                  src={clientLogos[index - 1]}
                  alt={`Client Logo ${index}`}
                  className="w-24 h-24 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
// List of Client logos
const clientLogos = [
  "https://ruba-it.com/wp-content/uploads/2024/02/website-logo-1-300x109.png",
  "https://storage.googleapis.com/wequi-3d3fb.appspot.com/merchants/aunun-text-icon-removebg-preview.png",
  "https://ruba-it.com/wp-content/uploads/2024/02/website-logo-1-300x109.png",
  "https://storage.googleapis.com/wequi-3d3fb.appspot.com/merchants/aunun-text-icon-removebg-preview.png",
];

export default ExperienceSection;

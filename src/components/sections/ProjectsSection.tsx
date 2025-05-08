
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'mobile' | 'web' | 'ui';
  technologies: string[];
  links: {
    github?: string;
    playstore?: string;
    appstore?: string;
    live?: string;
  }
};

const ProjectsSection = () => {
  const [filter, setFilter] = useState<'all' | 'mobile' | 'web' | 'ui'>('all');

  const projects: Project[] = [
    {
      id: 1,
      title: "E-commerce App",
      description: "A full-featured e-commerce application with cart, payment integration, and order tracking.",
      image: "bg-gradient-to-br from-purple-500 to-indigo-500",
      category: "mobile",
      technologies: ["Flutter", "Firebase", "Stripe", "Provider"],
      links: {
        github: "#",
        playstore: "#",
        appstore: "#"
      }
    },
    {
      id: 2,
      title: "Travel Companion",
      description: "A travel app that helps users discover places, plan trips, and share experiences.",
      image: "bg-gradient-to-br from-green-500 to-teal-500",
      category: "mobile",
      technologies: ["Flutter", "Google Maps API", "Firebase", "BLoC"],
      links: {
        github: "#",
        playstore: "#"
      }
    },
    {
      id: 3,
      title: "Task Management Dashboard",
      description: "A responsive web dashboard for managing tasks, projects, and team collaboration.",
      image: "bg-gradient-to-br from-blue-500 to-cyan-500",
      category: "web",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
      links: {
        github: "#",
        live: "#"
      }
    },
    {
      id: 4,
      title: "Fitness Tracking App",
      description: "An app to track workouts, nutrition, and health metrics with personalized recommendations.",
      image: "bg-gradient-to-br from-red-500 to-orange-500",
      category: "mobile",
      technologies: ["Flutter", "SQLite", "Charts", "GetX"],
      links: {
        github: "#",
        playstore: "#",
        appstore: "#"
      }
    },
    {
      id: 5,
      title: "Social Media UI Kit",
      description: "A comprehensive UI kit for social media applications with 50+ screen designs.",
      image: "bg-gradient-to-br from-pink-500 to-rose-500",
      category: "ui",
      technologies: ["Figma", "Adobe XD", "Flutter UI"],
      links: {
        github: "#",
        live: "#"
      }
    },
    {
      id: 6,
      title: "Weather Forecast App",
      description: "A beautiful weather app with detailed forecasts, animations, and location services.",
      image: "bg-gradient-to-br from-amber-400 to-orange-500",
      category: "mobile",
      technologies: ["Flutter", "Weather API", "Animations", "Riverpod"],
      links: {
        github: "#",
        playstore: "#"
      }
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            A showcase of my recent work, mobile applications, and design projects.
          </p>
          <div className="w-16 h-1 bg-flutter-blue mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-muted rounded-lg">
            {[
              { key: 'all', label: 'All Projects' },
              { key: 'mobile', label: 'Mobile Apps' },
              { key: 'web', label: 'Web Projects' },
              { key: 'ui', label: 'UI/UX Designs' }
            ].map((item) => (
              <Button
                key={item.key}
                variant={filter === item.key ? "default" : "ghost"}
                className={filter === item.key ? "bg-flutter-blue" : ""}
                onClick={() => setFilter(item.key as any)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="bg-white dark:bg-flutter-dark/20 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105 reveal"
            >
              <div className={`h-48 ${project.image} flex items-center justify-center`}>
                <span className="text-white text-2xl font-bold">
                  {project.title}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-foreground/70 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.links.github && (
                    <Button variant="outline" size="sm">
                      GitHub
                    </Button>
                  )}
                  {project.links.live && (
                    <Button variant="outline" size="sm">
                      Live Demo
                    </Button>
                  )}
                  {project.links.playstore && (
                    <Button variant="outline" size="sm">
                      Play Store
                    </Button>
                  )}
                  {project.links.appstore && (
                    <Button variant="outline" size="sm">
                      App Store
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-flutter-blue hover:bg-flutter-blue/90">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

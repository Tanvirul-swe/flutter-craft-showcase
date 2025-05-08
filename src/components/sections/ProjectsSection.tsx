
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  };
  detailedDescription?: string;
  challenges?: string;
  solutions?: string;
  results?: string;
};

const ProjectsSection = () => {
  const [filter, setFilter] = useState<'all' | 'mobile' | 'web' | 'ui'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
      },
      detailedDescription: "This e-commerce app allows users to browse products, add them to cart, and complete purchases using Stripe payment integration. It features real-time order tracking and notifications.",
      challenges: "Implementing real-time order status updates and ensuring a seamless payment flow were the main challenges.",
      solutions: "Used Firebase for real-time database capabilities and carefully designed the payment flow with proper error handling and user feedback.",
      results: "Increased conversion rate by 25% compared to the previous version, with a 40% reduction in cart abandonment."
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
      },
      detailedDescription: "Travel Companion assists users in discovering new destinations, planning itineraries, and sharing their journeys. It integrates with Google Maps for location services.",
      challenges: "Optimizing map performance while handling large datasets of points of interest was challenging.",
      solutions: "Implemented clustering for map markers and lazy loading of location data based on the visible region.",
      results: "App has 100K+ downloads on Play Store with a 4.7-star rating."
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
      },
      detailedDescription: "This dashboard helps teams manage tasks, track project progress, and collaborate effectively. It includes features like task assignments, due dates, and progress tracking.",
      challenges: "Creating an intuitive UI that works well across devices while maintaining complex state management.",
      solutions: "Used TypeScript and well-defined interfaces for type safety, and responsive design patterns for cross-device functionality.",
      results: "Used by over 50 companies to manage their project workflows, improving team productivity by an average of 30%."
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
      },
      detailedDescription: "This fitness app tracks workouts, nutrition, and health metrics while providing personalized recommendations based on user goals.",
      challenges: "Creating accurate workout tracking and generating meaningful insights from user data.",
      solutions: "Implemented custom algorithms for progress tracking and used machine learning for personalized recommendations.",
      results: "Users report an average 20% improvement in workout consistency and goal achievement."
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
      },
      detailedDescription: "This UI kit includes over 50 screen designs for social media applications, with components for feeds, profiles, messaging, and more.",
      challenges: "Creating designs that are both visually appealing and highly functional, while ensuring they can be implemented efficiently in Flutter.",
      solutions: "Used atomic design principles to create reusable components that maintain visual consistency across the app.",
      results: "Used by dozens of developers to accelerate their app development process, reducing UI development time by up to 60%."
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
      },
      detailedDescription: "This weather app provides detailed forecasts, beautiful animations, and location services for accurate local weather information.",
      challenges: "Creating smooth animations that enhance the user experience while ensuring accurate weather data.",
      solutions: "Built custom Flutter animations and integrated with multiple weather APIs for data redundancy and accuracy.",
      results: "Over 50K downloads with a 4.8-star average rating. Users particularly praise the beautiful UI and accurate forecasts."
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
  };

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
              className="bg-white dark:bg-flutter-dark/20 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:transform hover:scale-105 reveal cursor-pointer"
              onClick={() => openProjectDetails(project)}
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
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); window.open(project.links.github); }}>
                      GitHub
                    </Button>
                  )}
                  {project.links.live && (
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); window.open(project.links.live); }}>
                      Live Demo
                    </Button>
                  )}
                  {project.links.playstore && (
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); window.open(project.links.playstore); }}>
                      Play Store
                    </Button>
                  )}
                  {project.links.appstore && (
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); window.open(project.links.appstore); }}>
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

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
              <DialogDescription className="text-foreground/70">
                {selectedProject.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className={`h-48 ${selectedProject.image} flex items-center justify-center rounded-md mb-6`}>
              <span className="text-white text-2xl font-bold">
                {selectedProject.title}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Overview</h3>
                <p className="text-foreground/70">{selectedProject.detailedDescription}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, index) => (
                    <span key={index} className="text-sm bg-muted px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Challenges</h3>
                  <p className="text-foreground/70">{selectedProject.challenges}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Solutions</h3>
                  <p className="text-foreground/70">{selectedProject.solutions}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Results</h3>
                  <p className="text-foreground/70">{selectedProject.results}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4">
                {Object.entries(selectedProject.links).map(([key, value]) => (
                  value && (
                    <Button 
                      key={key} 
                      variant="outline"
                      onClick={() => window.open(value)}
                    >
                      {key === 'github' ? 'GitHub' : 
                       key === 'playstore' ? 'Play Store' : 
                       key === 'appstore' ? 'App Store' : 'Live Demo'}
                    </Button>
                  )
                ))}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};

export default ProjectsSection;

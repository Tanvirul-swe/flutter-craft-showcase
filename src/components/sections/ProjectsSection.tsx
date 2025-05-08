
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
      title: "WEQUI - Group Buy & Savings!",
      description: "A team-based shopping app that empowers users to save more through group buying and shared deals.",
      image: "bg-gradient-to-br from-purple-500 to-indigo-500",
      category: "mobile",
      technologies: ["Flutter", "Firebase", "Stripe", "Bloc", " REST API", "Go", "SQLite", "PostgreSQL", "Google Cloud", "Github Actions"],
      links: {
        github: "https://play.google.com/store/apps/details?id=xyz.wequi.wequi&hl=en&pli=1",
        live: "https://play.google.com/store/apps/details?id=xyz.wequi.wequi&hl=en&pli=1"
      },
      detailedDescription: "WEQUI is a mobile application that transforms the traditional shopping model by enabling users to form teams and unlock exclusive discounts through collective purchases. Designed with a focus on simplicity and user engagement, the app offers personalized product recommendations, real-time deal notifications, and a secure, fast checkout process. It fosters a social shopping experience by allowing users to invite friends, organize purchases together, and benefit from better pricing.",
      challenges: "Building a smooth team formation flow, syncing real-time group purchases, and integrating secure payment mechanisms across devices.",
      solutions: "Utilized Flutter to ensure a consistent cross-platform experience, Firebase for real-time updates and authentication, and custom REST APIs to manage team logic, product data, and deal tracking efficiently.",
      results: "Successfully launched with growing user adoption, the app has enabled teams to save up to 40% on average, with high engagement from both individual users and small business communities."
    },
    {
      id: 2,
      title: "WEQUI Merchant App",
      description: "An intuitive business management app for merchants to redeem vouchers, track sales, and analyze performance in real time.",
      image: "bg-gradient-to-br from-green-500 to-teal-500",
      category: "mobile",
      technologies: ["Flutter", "Firebase", "REST API", "QR Code Scanner"],
      links: {
        github: "https://play.google.com/store/apps/details?id=xyz.wequi.merchant&hl=en",
        playstore: "https://play.google.com/store/apps/details?id=xyz.wequi.merchant&hl=en"
      },
      detailedDescription: "The WEQUI Merchant App is built to empower vendors within the WEQUI ecosystem by streamlining their daily operations. It allows instant QR voucher redemption, secure transaction handling, and access to insightful sales analytics. Merchants can view transaction histories, track revenue, and monitor performance with real-time data, enabling smarter business decisions and strategy refinement.",
      challenges: "Creating a fast and secure QR redemption system while maintaining real-time data accuracy across multiple devices and users.",
      solutions: "Implemented robust QR scanning with instant validation, integrated Firebase for authentication and analytics, and used REST APIs to synchronize transaction data seamlessly.",
      results: "Adopted by a wide range of vendors, the app has reduced manual tracking efforts by 70% and significantly improved transaction accuracy and customer satisfaction."

    },
    {
      id: 3,
      title: "WEQUI Web Application",
      description: "A dynamic web platform built to support task coordination, team communication, and efficient project tracking.",
      image: "bg-gradient-to-br from-blue-500 to-cyan-500",
      category: "web",
      technologies: ["React", "Bootstrap", "JavaScript"],
      links: {
        github: "https://www.wequi.xyz",
        live: "https://www.wequi.xyz"
      },
      detailedDescription: "The WEQUI Web Application is a centralized workspace designed for teams to organize tasks, collaborate in real time, and maintain clarity over project progress. Built with a responsive layout, it adapts seamlessly to desktops, tablets, and mobile devices, making remote teamwork intuitive and accessible.",
      challenges: "Ensuring a clean and functional UI while managing multiple interactive components without compromising performance.",
      solutions: "Used React to build reusable and efficient UI components, Bootstrap for responsive design consistency, and JavaScript for handling dynamic content and interactions across the platform.",
      results: "Successfully adopted by multiple organizations, the app has enhanced coordination and helped teams complete projects with greater clarity and fewer delays."
    },

    {
      id: 4,
      title: "Anun Rider App",
      description: "A delivery partner app that empowers riders to earn, track income, and deliver products within the Anun social commerce ecosystem.",
      image: "bg-gradient-to-br from-red-500 to-orange-500",
      category: "mobile",
      technologies: ["Flutter", "Push Notification", "Bikash Payment", "Nagod Payment", "Bloc", " REST API"],
      links: {
        github: "https://play.google.com/store/apps/details?id=apprider.anun.xyz&hl=en",
        playstore: "https://play.google.com/store/apps/details?id=apprider.anun.xyz&hl=en",
        appstore: "https://play.google.com/store/apps/details?id=apprider.anun.xyz&hl=en"
      },
      detailedDescription: "Anun Rider is a dedicated logistics app for the Anun social commerce platform, enabling delivery personnel to manage and fulfill product deliveries efficiently. The app offers riders a user-friendly dashboard to accept orders, track delivery routes via maps, and monitor their weekly earnings. Riders benefit from flexible shifts, referral bonuses, and an integrated support system, including insurance coverage and real-time communication with support agents.",
      challenges: "Designing a lightweight, real-time delivery tracking system and building flexible shift management while maintaining secure data flow.",
      solutions: "Used Flutter for fast cross-platform development, Firebase for real-time data sync and push notifications, and Google Maps API for live route tracking and location-based services.",
      results: "The app has streamlined logistics operations for Anun, increased rider satisfaction, and reduced delivery times, contributing to better customer experiences across the platform."

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
      title: "Anun - Social Commerce",
      description: "Bangladesh's first team purchasing and group-buying mobile app offering discounts on food, groceries, and local vouchers.",
      image: "bg-gradient-to-br from-amber-400 to-orange-500",
      category: "mobile",
      technologies: ["Flutter", "Push Notification", "Bikash Payment", "Nagod Payment", "Bloc", " REST API"],
      links: {
        github: "https://play.google.com/store/apps/details?id=app.anun.xyz&hl=en",
        playstore: "https://play.google.com/store/apps/details?id=app.anun.xyz&hl=en"
      },
      detailedDescription: "Anun is a pioneering social commerce app in Bangladesh that introduces team purchasing—allowing users to buy individually or in groups for greater savings. Shoppers can initiate or join team purchases, share products via social media, and enjoy reduced prices. The app also offers local voucher deals, real-time order tracking, price chopping features, and hourly reward check-ins. It supports Q-commerce delivery for groceries, food, and medicine with lightning-fast service.",
      challenges: "Building a dynamic and secure team purchase system with refund logic, real-time sharing, and Q-commerce logistics in a scalable infrastructure.",
      solutions: "Implemented Flutter for cross-platform speed, Firebase for real-time updates, and integrated custom APIs to manage group orders, vouchers, and order tracking with social media link sharing.",
      results: "Anun has gained rapid traction across Bangladesh, being the first to offer a full-featured group buying experience, helping users save significantly while supporting local commerce. The app is now recognized as a leading Q-commerce and social commerce platform in the country."
    },
    {
      id: 7,
      title: "Ruba IT Solution",
      description: "A dynamic technology company offering end-to-end software development, mobile applications, web design, and digital solutions tailored to businesses across industries.",
      image: "bg-gradient-to-br from-purple-500 to-blue-500",
      category: "web",
      technologies: ["PHP", "WordPress"],
      links: {
        github: "https://ruba-it.com/",
        live: "https://ruba-it.com/"
      },

      detailedDescription: "RUBA IT Solution specializes in crafting custom software solutions, mobile apps, and websites that meet the unique needs of businesses. The company’s expertise lies in delivering scalable and secure technology to facilitate digital transformation, ensuring enhanced performance, user experience, and operational efficiency for its clients.",
      challenges: "Maintaining a consistent high standard of design and development while meeting the diverse needs of clients from different sectors.",
      solutions: "Adopted a flexible development approach, leveraging modern technologies like React and Flutter for rapid development and seamless cross-platform solutions, ensuring top-notch quality and scalability.",
      results: "RUBA IT Solution has successfully helped multiple businesses digitize their operations, improving overall productivity and customer engagement while providing cutting-edge web and mobile solutions."
    },
    {
      id: 4,
      title: "Flutter Blue Serial",
      description: "A Flutter package for communication with Bluetooth Classic devices, allowing the sending of commands and receiving responses from IoT devices.",
      image: "bg-gradient-to-br from-green-500 to-blue-500",
      category: "mobile",
      technologies: ["Flutter", "Bluetooth", "IoT", "Bluetooth Classic", "Java"],
      links: {
        github: "https://github.com/flutterblue/flutter_blue_serial",
        live: "https://github.com/flutterblue/flutter_blue_serial"
      },
      detailedDescription: "Flutter Blue Serial enables communication with Bluetooth Classic devices, such as IoT switches, via serial communication. This package helps send commands like 'on' and 'off' to devices, receive responses, and manage Bluetooth connections seamlessly. The package supports scanning for devices, connecting, sending data, and receiving device responses in real time.",
      challenges: "Handling Bluetooth communication across different devices with varying Bluetooth capabilities, ensuring smooth connection and data transfer between devices.",
      solutions: "Implemented serial communication methods to connect to Bluetooth Classic devices, send commands, and handle responses efficiently. Used Flutter's reactive framework to manage Bluetooth connection states and communication.",
      results: "Successfully integrated with multiple Bluetooth Classic IoT devices, allowing users to control devices (like smart switches) via Flutter apps with smooth user experiences and real-time communication."
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

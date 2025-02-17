
import { useRef, useEffect } from "react";
import { CircleArrowDown } from "lucide-react";

interface Project {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

const projects: Project[] = [
  {
    title: "dddc",
    description: "Medical platform",
    link: "med.dyrane.live",
    imageUrl: "/placeholder.svg"
  },
  {
    title: "Reflectify",
    description: "Reflection platform",
    link: "reflectify.dyrane.live",
    imageUrl: "/placeholder.svg"
  },
  {
    title: "Slatechain",
    description: "Blockchain solution",
    link: "slatechain.vercel.app",
    imageUrl: "/placeholder.svg"
  },
  {
    title: "Aquawallet",
    description: "Digital wallet",
    link: "aquawallet-coral.vercel.app",
    imageUrl: "/placeholder.svg"
  }
];

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold md:text-7xl">Dr. Dyrane</h1>
        <p className="mb-8 max-w-2xl text-lg opacity-80">
          Full-stack developer crafting elegant solutions with modern technologies
        </p>
        <CircleArrowDown 
          className="mt-8 h-12 w-12 animate-bounce cursor-pointer opacity-50 transition-opacity hover:opacity-100" 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        />
      </section>

      {/* Projects Grid */}
      <section className="px-4 py-20">
        <h2 className="animate-on-scroll mb-16 text-center text-4xl font-bold">
          Featured Projects
        </h2>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <a
              key={index}
              href={`https://${project.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-on-scroll project-card p-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="glass mb-4 aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
              <p className="text-sm opacity-70">{project.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;

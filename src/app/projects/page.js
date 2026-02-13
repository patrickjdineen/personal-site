import fs from "fs";
import path from "path";
import ProjectCard from "@/components/ProjectCard";

export const metadata = {
  title: "Projects — Patrick Dineen",
  description: "Things I've built",
};

function getProjects() {
  const filePath = path.join(process.cwd(), "content/projects.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Projects</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}

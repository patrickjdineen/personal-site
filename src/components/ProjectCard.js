import Link from "next/link";

export default function ProjectCard({ project }) {
  const isExternal = project.url.startsWith("http");
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={project.url}
      {...linkProps}
      className="group block rounded-xl border border-white/10 p-6 transition-colors hover:border-white/25"
    >
      <h2 className="text-lg font-semibold group-hover:text-neutral-300 transition-colors">
        {project.title}
      </h2>
      <p className="mt-2 text-sm text-neutral-400">{project.description}</p>
      {project.tags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

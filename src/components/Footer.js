export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-6 flex items-center justify-between text-sm text-neutral-500">
      <span>A photo a day, all through 2026.</span>
      <div className="flex gap-4">
        <a href="https://www.instagram.com/patrickjdineen/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
        <a href="https://www.linkedin.com/in/patrick-dineen/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        <a href="https://substack.com/@patrickgus" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Substack</a>
      </div>
    </footer>
  );
}

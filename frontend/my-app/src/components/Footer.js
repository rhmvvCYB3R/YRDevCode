// src/components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10 py-5">
      <div className="max-w-7xl mx-auto px-6 py-13 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} YRDevCode — Сделано для разработчиков
      </div>
    </footer>
  );
}

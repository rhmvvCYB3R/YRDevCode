// src/app/page.js
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-teal-50 text-gray-900">
      <Navbar />

      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-gray-800">
          Добро пожаловать в <span className="text-teal-600">YRDevCode</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl text-gray-600">
          Твоя социальная сеть для программистов — находи единомышленников, обсуждай технологии, создавай проекты.
        </p>
        <Link
          href="/register"
          className="px-10 py-4 text-white bg-teal-600 hover:bg-teal-700 transition rounded-full shadow-md text-lg font-semibold"
        >
          Присоединиться
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white shadow-xl rounded-3xl p-8 hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-semibold text-teal-700 mb-4">🔥 Популярные темы</h2>
          <p className="text-gray-600">
            Узнай, о чём сейчас говорят разработчики. Новейшие фреймворки, AI, web3 и многое другое.
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-3xl p-8 hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-semibold text-teal-700 mb-4">🤝 Создай проект</h2>
          <p className="text-gray-600">
            Хочешь создать что-то великое? Найди разработчиков с похожими интересами и начните прямо сейчас.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

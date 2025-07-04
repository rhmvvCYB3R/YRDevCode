"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";

const topicsData = [
  {
    id: 1,
    title: "Frontend на React",
    description: "Обсуждаем фреймворки, хуки и современные библиотеки UI",
  },
  {
    id: 2,
    title: "Backend с Spring Boot",
    description: "Создание REST API и интеграция с базами данных",
  },
  {
    id: 3,
    title: "Кибербезопасность",
    description: "Обмен опытом по защите приложений и анализу угроз",
  },
  {
    id: 4,
    title: "Flutter и мобильная разработка",
    description: "Создание кроссплатформенных приложений и UI дизайн",
  },
];

export default function TopicsPage() {
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState(topicsData);

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleJoin(id) {
    alert(`Присоединение к теме с id=${id} (позже будет переход в комнату)`);
    // Здесь можно будет использовать router.push(`/chat/${id}`) для перехода
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-teal-50 text-gray-900">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <input
          type="text"
          placeholder="Поиск тем..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 transition"
        />

        <ul className="space-y-6">
          {filteredTopics.length > 0 ? (
            filteredTopics.map(({ id, title, description }) => (
              <li
                key={id}
                className="bg-white rounded-3xl shadow-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold text-teal-700">{title}</h2>
                  <p className="text-gray-600 mt-1">{description}</p>
                </div>
                <button
                  onClick={() => handleJoin(id)}
                  className="ml-6 px-5 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
                >
                  Присоединиться
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Темы не найдены</p>
          )}
        </ul>
      </section>

      <Footer />
    </main>
  );
}

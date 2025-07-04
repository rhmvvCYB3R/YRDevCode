"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [topics] = useState(topicsData);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  function isAuthenticated() {
    // Тут должна быть реальная проверка, например проверка токена в localStorage
    return false; // заглушка — не авторизован
  }

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase())
  );

  function handleJoin(id) {
    if (!isAuthenticated()) {
      // Сохраняем ID темы для редиректа после логина
      localStorage.setItem("pendingTopicId", id.toString());
      setShowModal(true);
      return;
    }

    // Если авторизован — переход сразу
    router.push(`/chat/${id}`);
  }

  function goToLogin() {
    setShowModal(false);
    router.push("/login");
  }

  function closeModal() {
    setShowModal(false);
    localStorage.removeItem("pendingTopicId");
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-teal-50 text-gray-900">
      <Navbar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <input
          type="text"
          placeholder="Поиск тем..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 px-4 py-3 sm:px-5 sm:py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 transition text-base sm:text-lg"
        />

        <ul className="space-y-6">
          {filteredTopics.length > 0 ? (
            filteredTopics.map(({ id, title, description }) => (
              <li
                key={id}
                className="bg-white rounded-3xl shadow-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-teal-700">{title}</h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">{description}</p>
                </div>
                <button
                  onClick={() => handleJoin(id)}
                  className="self-start sm:self-auto px-5 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition text-sm sm:text-base"
                >
                  Присоединиться
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 text-base sm:text-lg">Темы не найдены</p>
          )}
        </ul>
      </section>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-20 backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm mx-4 text-center">
            <h2 className="text-xl font-semibold mb-4">Сначала авторизуйтесь</h2>
            <p className="mb-6 text-gray-700">
              Чтобы присоединиться к теме, необходимо войти в аккаунт.
            </p>
            <button
              onClick={goToLogin}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition mr-4"
            >
              Войти
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

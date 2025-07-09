"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const topicsData = [
  // ... твои темы
];

export default function TopicsPage() {
  const [search, setSearch] = useState("");
  const [topics] = useState(topicsData);
  const [showModal, setShowModal] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setIsAuthChecked(true);
      return;
    }

    // Проверяем валидность токена через API
    fetch("http://localhost:8080/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
        localStorage.removeItem("token"); // Удаляем невалидный токен
      })
      .finally(() => {
        setIsAuthChecked(true);
      });
  }, []);

  // Обработчик нажатия "Присоединиться"
  function handleJoin(id) {
    if (!isAuthChecked) {
      // Ещё не проверили, ждём
      return;
    }

    if (!isAuthenticated) {
      // Сохраняем ID темы для редиректа после логина
      localStorage.setItem("pendingTopicId", id.toString());
      setShowModal(true);
      return;
    }

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

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase())
  );

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
                  disabled={!isAuthChecked} // блокируем пока не проверили
                  className={`self-start sm:self-auto px-5 py-2 rounded-xl font-semibold text-white transition text-sm sm:text-base ${
                    isAuthChecked ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
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

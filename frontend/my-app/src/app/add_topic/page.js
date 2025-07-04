"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";

function isAuthenticated() {
  // Реальная проверка авторизации, например:
  // return Boolean(localStorage.getItem("token"));
  return false; // Заглушка для демонстрации
}

export default function AddTopicPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Название темы обязательно");
      return;
    }

    if (!isAuthenticated()) {
      setShowModal(true);
      return;
    }

    // Здесь логика отправки темы на сервер или обновления состояния
    alert(`Добавлена тема:\nНазвание: ${title}\nОписание: ${description}`);

    setTitle("");
    setDescription("");
  }

  function goToLogin() {
    router.push("/login");
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-teal-50 text-gray-900">
      <Navbar />

      <section className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">
          Добавить новую тему
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6"
        >
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Название темы *
            </label>
            <input
              type="text"
              placeholder="Введите название темы"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Описание темы
            </label>
            <textarea
              placeholder="Введите описание темы (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-gray-600 resize-none"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-teal-700 transition shadow-lg"
          >
            Добавить тему
          </button>
        </form>
      </section>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-20 backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm mx-4 text-center">
            <h2 className="text-xl font-semibold mb-4">Сначала авторизуйтесь</h2>
            <p className="mb-6 text-gray-700">
              Чтобы добавить тему, необходимо войти в аккаунт.
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

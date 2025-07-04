"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";

export default function ProfilePage() {
  // Заглушка с данными пользователя
  const [user, setUser] = useState({
    nickname: "rhmvv",
    email: "rhmvv@example.com",
    avatarUrl: "https://quasi-art.ru/data/images/works/it-cat.jpg",
    bio: "Будущий кибербезопасник и бэкенд-разработчик",
  });

  function handleEdit() {
    alert("Редактирование профиля (позже добавим форму и API)");
  }

  function handleLogout() {
    alert("Выход из аккаунта (реализация позже)");
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-teal-50 text-gray-900">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-10 flex flex-col items-center space-y-6">
          <img
            src={user.avatarUrl}
            alt="User avatar"
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
          <h1 className="text-4xl font-bold text-teal-700">{user.nickname}</h1>
          <p className="text-gray-600">{user.bio}</p>
          <p className="text-gray-500 italic">{user.email}</p>

          <div className="flex space-x-4 mt-6">
            <button
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
              onClick={handleEdit}
            >
              Редактировать профиль
            </button>
            <button
              className="px-6 py-3 border border-teal-600 text-teal-600 rounded-xl font-semibold hover:bg-teal-100 transition"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

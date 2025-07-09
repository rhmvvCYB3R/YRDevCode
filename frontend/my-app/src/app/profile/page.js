"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // SPA редирект
      return;
    }

    fetch("http://localhost:8080/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Ошибка получения профиля");
        }
        const data = await res.json();
        setUser(data);
      })
      .catch((err) => {
        console.error(err);
        router.push("/login"); // редирект при ошибке
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleEdit() {
    alert("Редактирование профиля (будет реализовано позже)");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login"); // SPA редирект
  }

  if (loading) {
    return <div className="text-center mt-20">Загрузка...</div>;
  }

  if (!user) {
    return null;
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

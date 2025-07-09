"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Импорт хука роутера
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ошибка при входе");
      } else {
        localStorage.setItem("token", data.token);
        router.push("/topics"); // Вот здесь делаем редирект
      }
    } catch (err) {
      setError("Ошибка сети. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-teal-50 text-gray-900">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">Вход</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-gray-600"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Пароль</label>
              <input
                type="password"
                placeholder="Введите пароль"
                className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-gray-600"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-red-600 text-center font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-teal-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-teal-700 transition shadow-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Загрузка..." : "Войти"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-teal-600 underline font-medium">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

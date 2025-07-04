import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-teal-50 text-gray-900">
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">Регистрация</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Никнейм</label>
              <input
                type="text"
                placeholder="Введите никнейм"
                className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Пароль</label>
              <input
                type="password"
                placeholder="Введите пароль"
                className="w-full px-5 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition text-gray-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-teal-700 transition shadow-lg"
            >
              Зарегистрироваться
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-teal-600 underline font-medium">
              Войти
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

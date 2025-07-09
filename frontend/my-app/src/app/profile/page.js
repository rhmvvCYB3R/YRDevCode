"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8080/api/auth/profile", {
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
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((e) => {
        console.error("Ошибка при загрузке профиля:", e);
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // --- Валидация формы ---
  function validateForm() {
    // Валидация только при редактировании
    if (isEditing) {
      if (!formData.name.trim()) {
        throw new Error("Имя не может быть пустым.");
      }
      if (!formData.email.trim()) {
        throw new Error("Email не может быть пустым.");
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error("Email введен некорректно.");
      }

      // Валидация пароля, только если пользователь пытается его изменить
      if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
          throw new Error("Для смены пароля заполните все три поля: текущий, новый и подтверждение.");
        }
        if (formData.newPassword.length < 8) {
          throw new Error("Новый пароль должен быть не менее 8 символов.");
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Новый пароль и подтверждение не совпадают.");
        }
      }
    }
  }
  // --- Конец валидации формы ---

  async function changePassword(token) {
    const res = await fetch("http://localhost:8080/api/auth/profile/password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }),
    });

    if (!res.ok) {
      let errorMessage = "Ошибка смены пароля";
      try {
        const data = await res.json();
        errorMessage = data.message || JSON.stringify(data);
      } catch {
        errorMessage = await res.text();
      }
      throw new Error(errorMessage);
    }
  }

  async function handleSave() {
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      validateForm(); // Вызываем валидацию перед отправкой
    } catch (e) {
      setError(e.message);
      return; // Прерываем сохранение, если есть ошибки валидации
    }

    setSaving(true);

    try {
      const resProfile = await fetch("http://localhost:8080/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
        }),
      });

      if (!resProfile.ok) {
        const errText = await resProfile.text();
        throw new Error(errText || "Ошибка обновления профиля.");
      }

      const updatedUser = await resProfile.json();
      setUser(updatedUser);

      // Меняем пароль, только если были введены поля пароля
      if (
        formData.currentPassword ||
        formData.newPassword ||
        formData.confirmPassword
      ) {
        await changePassword(token);
      }

      alert("Профиль успешно обновлен!");
      setIsEditing(false);
      // Сбрасываем поля пароля после успешного сохранения
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (e) {
      setError(e.message || "Произошла неизвестная ошибка при сохранении.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null); // Сбрасываем предыдущие ошибки

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Ошибка удаления профиля.");
      }

      localStorage.removeItem("token");
      alert("Профиль успешно удалён!");
      router.push("/login");
    } catch (e) {
      setError(e.message || "Произошла неизвестная ошибка при удалении профиля.");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return <div className="text-center mt-20 text-xl font-medium">Загрузка профиля...</div>;
  }

  if (!user) {
    // Если пользователь не загружен (например, после ошибки и редиректа),
    // то этот компонент не должен отображать ничего, пока роутер не перенаправит.
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-teal-50 text-gray-900">
      <Navbar />
      <section className="max-w-3xl mx-auto px-4 py-8 sm:px-6 sm:py-16">
        <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center space-y-4 relative sm:p-10 sm:space-y-6">
          <img
            src={
              user.avatarUrl ||
              "https://i.pinimg.com/originals/b6/14/61/b61461f70e6dec7ea7fa484b6a80f91c.jpg"
            }
            alt="User avatar"
            className="w-28 h-28 rounded-full object-cover shadow-md sm:w-32 sm:h-32"
          />

          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md sm:px-4 sm:py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Имя"
                disabled={saving}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md sm:px-4 sm:py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Email"
                disabled={saving}
              />
              <input
                type="text"
                name="role"
                value={formData.role}
                disabled
                className="w-full px-3 py-2 text-base bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed sm:px-4 sm:py-2 sm:text-lg"
                placeholder="Роль"
              />

              <hr className="w-full my-3 border-gray-200 sm:my-4" />

              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md sm:px-4 sm:py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Текущий пароль"
                disabled={saving}
              />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md sm:px-4 sm:py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Новый пароль"
                disabled={saving}
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md sm:px-4 sm:py-2 sm:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Подтвердите новый пароль"
                disabled={saving}
              />

              {error && <p className="mt-2 text-center text-sm text-red-600 sm:text-base">{error}</p>}

              <div className="flex flex-col w-full space-y-3 mt-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:mt-6">
                <button
                  className="w-full px-4 py-2 font-semibold text-white transition rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 sm:w-auto sm:px-6 sm:py-3"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Сохраняем..." : "Сохранить"}
                </button>
                <button
                  className="w-full px-4 py-2 font-semibold text-teal-600 transition border rounded-xl border-teal-600 hover:bg-teal-100 sm:w-auto sm:px-6 sm:py-3"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null); // Сбрасываем ошибки при отмене
                    setFormData({
                      name: user.name,
                      email: user.email,
                      role: user.role,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  disabled={saving}
                >
                  Отмена
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-center text-teal-700 sm:text-4xl">{user.name}</h1>
              <p className="italic text-gray-500 text-center text-base sm:text-lg">{user.email}</p>
              <p className="italic text-gray-500 text-center text-base sm:text-lg">{user.role}</p>

              {error && <p className="mt-2 text-center text-sm text-red-600 sm:text-base">{error}</p>}

              <div className="flex flex-col w-full space-y-3 mt-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 font-semibold text-white transition rounded-xl bg-teal-600 hover:bg-teal-700 sm:w-auto sm:px-6 sm:py-3"
                >
                  Редактировать
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 font-semibold text-teal-600 transition border rounded-xl border-teal-600 hover:bg-teal-100 sm:w-auto sm:px-6 sm:py-3"
                >
                  Выйти
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full px-4 py-2 font-semibold text-white transition rounded-xl bg-red-600 hover:bg-red-700 sm:w-auto sm:px-6 sm:py-3"
                >
                  Удалить профиль
                </button>
              </div>
            </>
          )}

          {confirmDelete && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 rounded-3xl backdrop-blur-md bg-white/30 sm:p-10 sm:space-y-6">
              <p className="text-lg font-semibold text-center text-gray-900 sm:text-xl">
                Вы уверены, что хотите удалить профиль?
              </p>
              <div className="flex flex-col w-full space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 font-semibold text-white transition rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 sm:w-auto sm:px-6 sm:py-3"
                  disabled={deleting}
                >
                  {deleting ? "Удаляем..." : "Да, удалить"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="w-full px-4 py-2 font-semibold text-red-600 transition border rounded-xl border-red-600 hover:bg-red-100 sm:w-auto sm:px-6 sm:py-3"
                  disabled={deleting}
                >
                  Отмена
                </button>
              </div>
              {error && <p className="mt-2 text-center text-sm text-red-700 sm:text-base">{error}</p>}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
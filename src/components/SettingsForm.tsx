"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentSecurityWord, setCurrentSecurityWord] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newSecurityWord, setNewSecurityWord] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          currentSecurityWord,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined,
          newSecurityWord: newSecurityWord || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess("Credenciales actualizadas correctamente");
      setCurrentPassword("");
      setCurrentSecurityWord("");
      setNewUsername("");
      setNewPassword("");
      setNewSecurityWord("");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
          <button
            onClick={() => router.push("/chat")}
            className="text-dark-400 hover:text-white transition-colors"
          >
            Volver al chat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current credentials */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-dark-400 uppercase tracking-wide">
              Credenciales actuales
            </h2>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Contraseña actual"
              required
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-dark-400 transition-colors"
            />
            <input
              type="password"
              value={currentSecurityWord}
              onChange={(e) => setCurrentSecurityWord(e.target.value)}
              placeholder="Palabra de seguridad actual"
              required
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-dark-400 transition-colors"
            />
          </div>

          {/* New credentials */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-dark-400 uppercase tracking-wide">
              Nuevas credenciales (deja vacío para no cambiar)
            </h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Nuevo usuario"
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-dark-400 transition-colors"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-dark-400 transition-colors"
            />
            <input
              type="password"
              value={newSecurityWord}
              onChange={(e) => setNewSecurityWord(e.target.value)}
              placeholder="Nueva palabra de seguridad"
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-dark-400 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? "Actualizando..." : "Actualizar credenciales"}
          </button>
        </form>
      </div>
    </div>
  );
}

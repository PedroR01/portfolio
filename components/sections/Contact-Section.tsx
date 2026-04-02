"use client";

import { useState } from "react";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    });

    setLoading(false);
  }

  return (
    <section id="contact" className="py-24 bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">Hablemos sobre tu proyecto</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            placeholder="Nombre"
            required
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
          />

          <textarea
            name="message"
            placeholder="Cuéntame tu idea..."
            required
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
          />

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg"
          >
            {loading ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </section>
  );
}

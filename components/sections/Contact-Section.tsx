"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      if (res.ok) {
        toast.success("Mensaje enviado", {
          description: "Te responderé lo antes posible.",
        });
        form.reset();
      } else {
        const data = await res.json();
        if (res.status === 429) {
          toast.warning("Demasiados intentos", {
            description: "Espera un momento antes de volver a intentarlo.",
          });
        } else {
          toast.error("No se pudo enviar", {
            description: data.error ?? "Inténtalo de nuevo más tarde.",
          });
        }
      }
    } catch {
      toast.error("Error de red", {
        description: "Revisa tu conexión e inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
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
            className="w-full px-6 py-3 rounded-lg bg-accent-btn font-archivo font-normal border-accent-foreground border-2 shadow-[0_5px_50px_-2px_rgba(11,210,150,0.2)] transition-all duration-200 transform active:scale-75 hover:bg-accent-btn-hover active:bg-accent-btn-active cursor-pointer"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </section>
  );
}

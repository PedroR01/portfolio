import Navbar from "@/components/ui/Navbar";
import ContactSection from "@/components/sections/Contact-Section";
import TestimonialsSection from "@/components/sections/Testimonials-Section";
import ScrollProgressBar from "@/components/effects/Scroll-Progress-Bar";
import ExperienceProjectTransition from "@/components/effects/Experience-Project-Transition";
import HeroSection from "@/components/sections/Hero-Section";

export default function Home() {
  return (
    <main className="overflow-hidden bg-black">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <ExperienceProjectTransition />
      <TestimonialsSection />
      <ContactSection />
      <footer>
        © 2026 Pe-Rob. Made in Argentina 🇦🇷 GitHub LinkedIn Twitter{" "}
      </footer>
    </main>
  );
}

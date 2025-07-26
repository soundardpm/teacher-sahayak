"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  React.useEffect(() => {
    // Initialize AOS animations
    const initAOS = async () => {
      const AOS = (await import('aos')).default;
      await import('aos/dist/aos.css');
      AOS.init({ duration: 1000, once: true });
    };
    initAOS();
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="w-full bg-white shadow fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-3">
            <Image 
              src="/logo.jpeg" 
              alt="Sahayak AI Logo" 
              width={40} 
              height={40} 
              className="rounded-lg"
            />
            <div className="text-2xl font-bold text-indigo-700">Sahayak AI</div>
          </div>
          <nav className="space-x-4">
            <a href="#features" className="text-gray-700 hover:text-indigo-600">Features</a>
            <a href="#why" className="text-gray-700 hover:text-indigo-600">Why Sahayak?</a>
            <a href="#cta" className="text-gray-700 hover:text-indigo-600">Dashboard</a>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-indigo-100 to-white">
          <h1 data-aos="fade-up" className="text-4xl md:text-5xl font-bold mb-4 text-indigo-800">
            Empowering Teachers. Transforming Classrooms.
          </h1>
          <p data-aos="fade-up" data-aos-delay="100" className="text-lg md:text-xl mb-6 text-gray-700 max-w-2xl">
            An AI-powered teaching assistant for India's multi-grade, low-resource classrooms. Create lessons, generate worksheets, and bring learning to life—instantly.
          </p>
          <div data-aos="zoom-in" data-aos-delay="200">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
              See How It Works
            </button>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-20 px-6 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">One Teacher. Many Grades. Infinite Challenges.</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Across countless schools in India, teachers manage multiple grades with limited tools and time. Sahayak AI is built to amplify their efforts—making content creation and lesson planning effortless.
          </p>
        </section>

        {/* What is Sahayak */}
        <section className="py-20 bg-gray-50 text-center px-6" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4">Your AI-Powered Teaching Companion.</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Sahayak AI uses Gemini + Vertex AI to simplify lesson prep, generate hyper-local content, create differentiated worksheets, and explain concepts in local languages—all at the speed of thought.
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-center mb-12">Everything Teachers Need. All in One Place.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">Lesson Planner AI</h3>
              <p className="text-gray-600 text-sm">Create weekly or daily lesson plans in seconds.</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">Content Creation</h3>
              <p className="text-gray-600 text-sm">Worksheets, stories, real-world examples, and diagrams.</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">Interactive Activities</h3>
              <p className="text-gray-600 text-sm">Auto-generate quizzes, puzzles, and memory games.</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">Audio-Visual Aid</h3>
              <p className="text-gray-600 text-sm">Generate spoken explanations and blackboard-friendly visuals.</p>
            </div>
          </div>
        </section>

        {/* Why Sahayak */}
        <section id="why" className="py-20 bg-indigo-50 px-6 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-8">Why Sahayak?</h2>
          <ul className="text-gray-700 max-w-xl mx-auto space-y-4">
            <li>• Hyper-local content in regional languages</li>
            <li>• Instant answers to tough student questions</li>
            <li>• Save hours with automated lesson planning</li>
            <li>• Audio-based reading assessments and educational games</li>
          </ul>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-20 text-center" data-aos="zoom-in">
          <h2 className="text-3xl font-bold mb-6">Ready to Teach Smarter?</h2>
          <div className="space-x-4">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
              Start with Sahayak
            </button>
            <Link href="/dashboard">
              <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-20" data-aos="fade-up">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-semibold mb-2 text-white">Sahayak AI</h3>
          <p className="text-sm mb-4">
            Built to empower teachers and transform classrooms with AI.  
            Inspired by the belief that <strong>every teacher deserves a co-pilot</strong>.
          </p>
          <div className="space-x-4 mb-4">
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Support</a>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 Sahayak AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

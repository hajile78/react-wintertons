import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Menu, X } from "lucide-react";

export default function Design2Layout() {
  const [menuOpen, setMenuOpen] = React.useState(false); 
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Modern Blog</h1>

          {/* Desktop Nav */}
          <nav className="space-x-6 text-lg hidden md:block">
            <a href="#" className="hover:text-blue-600 transition">Home</a>
            <a href="#" className="hover:text-blue-600 transition">Blog</a>
            <a href="#" className="hover:text-blue-600 transition">About</a>
            <a href="#" className="hover:text-blue-600 transition">Contact</a>
          </nav>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded hover:bg-gray-100">
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-inner border-t p-6 space-y-4">
            <a href="#" className="block text-lg hover:text-blue-600">Home</a>
            <a href="#" className="block text-lg hover:text-blue-600">Blog</a>
            <a href="#" className="block text-lg hover:text-blue-600">About</a>
            <a href="#" className="block text-lg hover:text-blue-600">Contact</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white pt-28 pb-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Welcome to the Modern Blog</h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Clean. Responsive. Minimal. Designed for content creators.
          </p>
          <Button className="mt-8 bg-white text-blue-700 hover:bg-gray-100 text-lg px-6 py-3 rounded-xl shadow">
            Get Started
          </Button>
        </div>
      </section>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 -mt-20 pb-20">
        {/* Posts */}
        <div className="lg:col-span-2 space-y-10">
          {[1, 2, 3].map((post) => (
            <motion.div
              key={post}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: post * 0.1 }}
            >
              <Card className="rounded-2xl shadow-lg overflow-hidden bg-white">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Blog Post Title {post}</h3>
                  <p className="text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pharetra varius quam sit amet vulputate.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Read More</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Aside */}
        <aside className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold mb-4">About This Blog</h4>
              <p className="text-gray-600 text-sm">
                A clean modern layout built with React + Tailwind + Motion.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h4 className="text-xl font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Design</li>
                <li>Technology</li>
                <li>Lifestyle</li>
                <li>Development</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">© 2025 My Modern Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

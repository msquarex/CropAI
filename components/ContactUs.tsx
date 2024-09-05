'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactUs() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white text-emerald-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-emerald-200 bg-white/90 backdrop-blur-sm fixed w-full z-50">
        <Link href="/" className="flex items-center justify-center">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="ml-2 text-xl font-bold text-emerald-800">CropAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-emerald-100 to-teal-50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-emerald-900 leading-tight">
                Get in Touch
              </h1>
              <p className="mt-4 text-emerald-800 text-lg md:text-xl max-w-[700px] mx-auto">
                Have questions or need assistance? We&apos;re here to help. Reach out to us using any of the methods below.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Mail, title: "Email Us", content: "support@cropai.com" },
                { icon: Phone, title: "Call Us", content: "+1 (555) 123-4567" },
                { icon: MapPin, title: "Visit Us", content: "VIT Chennai, Vandalur, Chennai, Tamil Nadu 600127" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-emerald-50 border-emerald-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="h-12 w-12 text-emerald-600" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-emerald-800">{item.title}</h3>
                      <p className="text-center text-emerald-700">{item.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <Card className="bg-white border-emerald-200">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-emerald-800 mb-4">Send us a Message</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-emerald-700">Name</label>
                      <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-emerald-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-emerald-700">Email</label>
                      <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-emerald-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-emerald-700">Message</label>
                      <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-emerald-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"></textarea>
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <p className="text-emerald-300 md:text-xl">
              &copy; 2024 Crop+. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="/termsNservice" className="text-sm font-medium hover:text-emerald-400 hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="/termsNservice" className="text-sm font-medium hover:text-emerald-400 hover:underline underline-offset-4">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
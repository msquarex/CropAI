'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsAndPrivacy() {
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
                Terms of Service & Privacy Policy
              </h1>
              <p className="mt-4 text-emerald-800 text-lg md:text-xl max-w-[700px] mx-auto">
                Please read these terms carefully before using our services.
              </p>
            </motion.div>

            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Terms of Service</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-emerald-700 mb-4">
                    By accessing and using CropAI, you agree to be bound by these Terms of Service. Our service is designed to provide AI-powered crop health monitoring and analysis.
                  </p>
                  <p className="text-emerald-700 mb-4">
                    You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                  </p>
                  <p className="text-emerald-700">
                    We reserve the right to modify or terminate the service for any reason, without notice at any time. We reserve the right to alter these Terms of Service at any time.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Privacy Policy</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-emerald-700 mb-4">
                    At CropAI, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
                  </p>
                  <p className="text-emerald-700 mb-4">
                    We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include your name, email address, and information about your crops.
                  </p>
                  <p className="text-emerald-700">
                    We use this information to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations. We do not sell your personal information to third parties.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Link href="/">
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300">
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <p className="text-emerald-300 md:text-xl">
              &copy; 2024 CropAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
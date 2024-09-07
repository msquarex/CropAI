'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Leaf, BarChart, Shield, ArrowRight, Menu } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-white text-emerald-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-emerald-200 bg-white/90 backdrop-blur-sm fixed w-full z-50">
        <Link href="#" className="flex items-center justify-center">
          <Leaf className="h-6 w-6 text-emerald-600" />
          <span className="ml-2 text-xl font-bold text-emerald-800">CropAI</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/about" className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
              Features
            </a>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/about"  className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
              Pricing
            </a>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/contact" className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
              Contact
            </Link>
          </motion.div>
          {user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/dashboard" className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
                  Dashboard
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button onClick={handleLogout} className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
                  Log Out
                </button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login" className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
                  Log In
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/signup" className="text-sm font-medium hover:text-emerald-600 hover:underline underline-offset-4">
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </nav>
        <button onClick={toggleMenu} className="ml-auto md:hidden">
          <Menu className="h-6 w-6 text-emerald-600" />
        </button>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a href="/about" className="text-lg font-medium" onClick={toggleMenu}>
              Features
            </a>
            <a href="/about" className="text-lg font-medium" onClick={toggleMenu}>
              Pricing
            </a>
            <Link href="/contact" className="text-lg font-medium" onClick={toggleMenu}>
              Contact
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-lg font-medium" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="text-lg font-medium">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-lg font-medium" onClick={toggleMenu}>
                  Log In
                </Link>
                <Link href="/signup" className="text-lg font-medium" onClick={toggleMenu}>
                  Sign Up
                </Link>
              </>
            )}
            <button onClick={toggleMenu} className="mt-8 text-emerald-600">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-emerald-100 to-teal-50 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              backgroundSize: ['100% 100%', '200% 200%'],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 20,
            }}
            style={{
              backgroundImage: 'url("/images/leaf-pattern.jpg")',
              opacity: 0.1,
            }}
          />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div 
                className="flex flex-col items-start space-y-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-emerald-900 leading-tight">
                  AI-Powered Crop Health <span className="text-emerald-600">Monitoring</span>
                </h1>
                <p className="text-emerald-800 text-lg md:text-xl max-w-[600px]">
                  Revolutionize your farming with our advanced AI and ML technology. Monitor crop health and detect diseases using aerial imagery.
                </p>
                <div className="flex space-x-4">
                  {user ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/dashboard">
                        <Button className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300" size="lg">
                          Go to Dashboard
                        </Button>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/signup">
                        <Button className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300" size="lg">
                          Sign Up Now
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/about">
                      <Button className="bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-600 transition-all duration-300" size="lg">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div 
                className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/images/crop-field.jpg"
                  alt="Crop field with drone"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section ref={featuresRef} id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-emerald-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Key Features
            </motion.h2>
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                { icon: Target, title: "Accurate Results", description: "Get accurate results with our advanced ML model trained on millions of images." },
                { icon: BarChart, title: "AI Analysis", description: "Our advanced AI algorithms analyze images to detect crop health issues and diseases." },
                { icon: Shield, title: "Early Detection", description: "Identify potential problems before they become serious, saving time and resources." }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="bg-emerald-50 border-emerald-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="h-12 w-12 text-emerald-600" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-emerald-800">{feature.title}</h3>
                      <p className="text-center text-emerald-700">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section ref={pricingRef} id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-emerald-700 text-white relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 z-0"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              className="flex flex-col items-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to Revolutionize Your Farming?
              </h2>
              <p className="mx-auto max-w-[700px] text-emerald-100 md:text-xl">
                Join the CropAI community today and start monitoring your crop health with ease.
              </p>
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-white text-emerald-700 hover:bg-emerald-50 transition-all duration-300" size="lg">
                    Sign Up Now
                  </Button>
                </motion.div>
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
            <nav className="flex gap-4 sm:gap-6">
              <Link href="/termsNservice" className="text-sm font-medium hover:text-emerald-400 hover:underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="/termsNservice" className="text-sm font-medium hover:text-emerald-400 hover:underline underline-offset-4">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-emerald-400 hover:underline underline-offset-4">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

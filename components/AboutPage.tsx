'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Cpu, Cloud, BarChart, Shield, Zap, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Cpu, title: "AI-Powered Analysis", description: "Our advanced AI algorithms provide accurate crop health assessments." },
  { icon: Cloud, title: "Cloud-Based Platform", description: "Access your data anytime, anywhere with our cloud-based solution." },
  { icon: BarChart, title: "Detailed Analytics", description: "Get in-depth insights into your crop's performance and health trends." },
  { icon: Shield, title: "Early Disease Detection", description: "Identify potential crop diseases before they become a major issue." },
  { icon: Zap, title: "Real-Time Monitoring", description: "Receive instant updates on your crop's health and environmental conditions." },
];

const pricingPlans = [
  { name: "Basic", price: "$29", features: ["5 fields", "Weekly analysis", "Basic reporting", "Email support"] },
  { name: "Pro", price: "$79", features: ["15 fields", "Daily analysis", "Advanced reporting", "Priority support", "Custom alerts"] },
  { name: "Enterprise", price: "Custom", features: ["Unlimited fields", "Real-time analysis", "Custom integrations", "Dedicated account manager", "24/7 phone support"] },
];

export default function AboutPage() {
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
         
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-emerald-100 to-teal-50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-emerald-900 leading-tight">
                Revolutionizing Crop Health Monitoring
              </h1>
              <p className="mt-4 text-emerald-800 text-lg md:text-xl max-w-[700px] mx-auto">
                CropAI uses cutting-edge AI technology to provide farmers with real-time insights and actionable recommendations for optimal crop health.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-emerald-800"
            >
              Our Powerful Features
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-emerald-50 border-emerald-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
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

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-emerald-800"
            >
              How CropAI Works
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: "Upload Images", description: "Take photos of your crops or upload existing images to our platform." },
                { title: "AI Analysis", description: "Our advanced AI algorithms analyze the images to assess crop health and detect issues." },
                { title: "Get Insights", description: "Receive detailed reports and actionable recommendations to improve your crop yield." },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">{step.title}</h3>
                  <p className="text-emerald-700">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-emerald-800"
            >
              Pricing Plans
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-emerald-50 border-emerald-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <h3 className="text-2xl font-bold text-emerald-800">{plan.name}</h3>
                      <div className="text-4xl font-bold text-emerald-600">{plan.price}</div>
                      <ul className="text-emerald-700 space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <DollarSign className="h-5 w-5 text-emerald-600 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300">
                        Choose Plan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
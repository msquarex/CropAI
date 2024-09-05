"use client";

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Leaf, Bug, Droplet, Upload, User, Camera, X, Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const analyzeSteps = ['Analyzing Photo', 'Checking Crops', 'Detecting Diseases']

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalyzeStep((prevStep) => (prevStep + 1) % analyzeSteps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
      startAnalysis()
    }
  }

  const handleCameraCapture = async () => {
    try {
      setIsCameraOpen(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsCameraOpen(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
        setPreviewUrl(imageDataUrl)
        closeCamera()
        startAnalysis()
      }
    }
  }

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
    setIsCameraOpen(false)
  }

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 6000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-emerald-50">
      <header className="bg-emerald-600 text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Leaf className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">CropAI</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="hover:underline flex items-center">
            <Home className="h-5 w-5 mr-1" />
            Home
          </Link>
          
          
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User account</span>
          </Button>
        </nav>
      </header>

      <motion.main
        className="flex-1 p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-emerald-800">Dashboard</h2>
            
          </div>

          <motion.div variants={itemVariants}>
            <Card className="bg-emerald-100 border-emerald-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">Crop Image Analysis</h3>
                <p className="text-emerald-700 mb-6">Upload or take a photo of your crops for instant analysis and recommendations.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={handleCameraCapture}
                  >
                    <Camera className="mr-2 h-4 w-4" /> Take Photo
                  </Button>
                </div>
                {isCameraOpen && (
                  <div className="mt-4 relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                      <Button onClick={capturePhoto} className="bg-emerald-600 text-white hover:bg-emerald-700">
                        Capture
                      </Button>
                      <Button onClick={closeCamera} className="bg-red-600 text-white hover:bg-red-700">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
                {isAnalyzing && (
                  
                  <div className="mt-4 text-center">
                    <p className="text-emerald-700 font-semibold">{analyzeSteps[analyzeStep]}</p>
                    <div className="w-full bg-emerald-200 rounded-full h-2.5 mt-2">
                      <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${((analyzeStep + 1) / analyzeSteps.length) * 100}%` }}></div>
                    </div>
                  </div>
                )}
                {previewUrl && (
                  <div className="mt-4">
                    <img src={previewUrl} alt="Captured crop" className="max-w-full h-auto rounded-lg shadow-md" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {['Overall Crop Health', 'Disease Detection', 'Nutrient Deficiencies'].map((title) => (
              <motion.div key={title} variants={itemVariants}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-5xl font-bold text-emerald-600">87%</span>
                      <Leaf className="h-12 w-12 text-emerald-600" />
                    </div>
                    <p className="mt-2 text-emerald-700">Your crops are in good health overall.</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Farming Recommendations</h3>
            <p className="text-emerald-700 mb-6">Get personalized recommendations to improve your crop health and yield.</p>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {['Irrigation Advice', 'Fertilizer Recommendations', 'Pest Management'].map((title) => (
                <motion.div key={title} variants={itemVariants}>
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold mb-2 text-emerald-800">{title}</h4>
                      <p className="text-emerald-700 mb-4">Optimize your irrigation schedule based on soil moisture and weather data.</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-emerald-600">Recommended Schedule</span>
                          <span className="font-semibold">3 times per week, 45 minutes each</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-600">Estimated Water Savings</span>
                          <span className="font-semibold">20%</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4 text-emerald-600 border-emerald-600 hover:bg-emerald-100">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.main>

      <footer className="bg-emerald-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Crop+</h3>
              <p className="text-emerald-200">Empowering farmers with AI-driven insights for sustainable agriculture.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-emerald-200 hover:text-white">Home</Link></li>
                <li><Link href="/about" className="text-emerald-200 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-emerald-200 hover:text-white">Contact</Link></li>
                <li><Link href="/termsNservice" className="text-emerald-200 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-emerald-200 hover:text-white"><Facebook /></a>
                <a href="#" className="text-emerald-200 hover:text-white"><Twitter /></a>
                <a href="#" className="text-emerald-200 hover:text-white"><Instagram /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-emerald-700 text-center text-emerald-200">
            <p>&copy; 2024 Crop+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
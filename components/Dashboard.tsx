"use client";

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Leaf, Bug, Droplet, Upload, User, Camera, X, Facebook, Twitter, Instagram, CameraIcon, SwitchCamera } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState(0)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [predictionResult, setPredictionResult] = useState<{
    predicted_class: string;
    confidence_score: number;
  } | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const analyzeSteps = ['Analyzing Photo', 'Checking Crops', 'Detecting Diseases']

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalyzeStep((prevStep) => (prevStep + 1) % analyzeSteps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, analyzeSteps.length]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPredictionResult(null);
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
      sendImageToAPI(file)
    }
  }

  const handleCameraCapture = async () => {
    try {
      setIsCameraOpen(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsCameraOpen(false)
    }
  }

  const switchCamera = async () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user')
    if (isCameraOpen) {
      await closeCamera()
      handleCameraCapture()
    }
  }

  const capturePhoto = () => {
    setPredictionResult(null);
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
        setPreviewUrl(imageDataUrl)
        closeCamera()
        
        // Convert data URL to Blob
        fetch(imageDataUrl)
          .then(res => res.blob())
          .then(blob => sendImageToAPI(blob))
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
    }, 10000) // Stop after 10 seconds max
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

  const sendImageToAPI = async (imageFile: File | Blob) => {
    setIsAnalyzing(true);
    setLoadingProgress(0);
    const formData = new FormData();
    formData.append('image', imageFile);

    // Start the loading bar animation
    const startTime = Date.now();
    const animationDuration = 3000; // 3 seconds
    const animationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min((elapsedTime / animationDuration) * 100, 100);
      setLoadingProgress(progress);
      
      if (progress === 100) {
        clearInterval(animationInterval);
      }
    }, 30); // Update every 30ms for smoother animation

    try {
      const response = await axios.post('http://localhost:8000/predict_tea_disease', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000,
        withCredentials: true
      });

      console.log('API Response:', response.data);
      setPredictionResult(response.data);
    } catch (error) {
      console.error('Error sending image to API:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      // Ensure the loading bar completes the full 3 seconds
      const remainingTime = Math.max(0, animationDuration - (Date.now() - startTime));
      setTimeout(() => {
        clearInterval(animationInterval);
        setLoadingProgress(100);
        setIsAnalyzing(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    console.log('isAnalyzing:', isAnalyzing);
  }, [isAnalyzing]);

  useEffect(() => {
    console.log('predictionResult:', predictionResult);
  }, [predictionResult]);

  const LoadingBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-emerald-200 rounded-full h-2.5 mb-4">
      <div 
        className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

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
          
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
            Log Out
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
                        <CameraIcon className="mr-2 h-4 w-4" /> Capture
                      </Button>
                      <Button onClick={switchCamera} className="bg-emerald-600 text-white hover:bg-emerald-700">
                        <SwitchCamera className="mr-2 h-4 w-4" /> Switch Camera
                      </Button>
                      <Button onClick={closeCamera} className="bg-red-600 text-white hover:bg-red-700">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
                {isAnalyzing && (
                  <div className="mt-4">
                    <p className="text-emerald-700 mb-2">Analyzing image...</p>
                    <LoadingBar progress={loadingProgress} />
                  </div>
                )}
                  {previewUrl && (
                    <div className="mt-4">
                      <div className="max-w-md mx-auto"> {/* Add this wrapper */}
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={previewUrl} 
                          alt="Captured crop" 
                          className="w-full h-full object-contain" 
                        />
                      </div>  
                    </div>
                  </div>
                )}
                
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {['Disease Detection', 'Accuracy Score'].map((title) => (
              <motion.div key={title} variants={itemVariants}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-5xl font-bold text-emerald-600">
                        {title === 'Disease Detection' 
                          ? (predictionResult?.predicted_class || 'No Prediction')
                          : (predictionResult 
                              ? `${(predictionResult.confidence_score * 100).toFixed(2)}%` 
                              : 'N/A'
                            )}
                      </span>
                      <Leaf className="h-12 w-12 text-emerald-600" />
                    </div>
                    
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
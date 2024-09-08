"use client";

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Leaf, Bug, Droplet, Upload, User, Camera, X, Facebook, Twitter, Instagram, CameraIcon, SwitchCamera, Info, BarChart2, Sprout } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Tooltip } from "@/components/ui/tooltip"

const diseaseCures = {
  "bird eye spot in tea": {
    treatment: [
      "Remove and destroy infected leaves",
      "Apply fungicides containing azoxystrobin or difenoconazole",
      "Improve air circulation in the tea garden",
      "Avoid overhead irrigation to reduce leaf wetness"
    ],
    irrigation: "Reduce frequency of irrigation and avoid overhead watering. Use drip irrigation if possible.",
    fertilizer: "Maintain balanced nutrition. Avoid excess nitrogen application.",
    pestManagement: "Monitor for insects that may create entry points for the fungus. Use appropriate insecticides if necessary."
  },
  "algal leaf in tea": {
    treatment: [
      "Prune affected areas to improve sunlight penetration and air flow",
      "Apply copper-based fungicides as per local agricultural guidelines",
      "Reduce humidity and leaf wetness in the tea plantation",
      "Ensure proper drainage in the tea garden"
    ],
    irrigation: "Improve drainage in the tea garden. Avoid waterlogging at all costs.",
    fertilizer: "Ensure proper potassium levels to improve plant resistance. Avoid over-fertilization.",
    pestManagement: "Algal leaf is not caused by pests, but maintaining plant health can prevent secondary infections."
  },
  "anthracnose in tea": {
    treatment: [
      "Remove and destroy infected plant parts",
      "Apply fungicides containing copper or chlorothalonil as recommended",
      "Improve air circulation by proper spacing and pruning",
      "Avoid wounding tea plants during cultural practices"
    ],
    irrigation: "Water at the base of plants to keep foliage dry. Improve soil drainage if necessary.",
    fertilizer: "Maintain balanced nutrition. Avoid excessive nitrogen which can promote soft, susceptible growth.",
    pestManagement: "Control insects that may create wounds on plants, providing entry points for the fungus."
  },
  "brown blight in tea": {
    treatment: [
      "Prune and destroy severely infected branches",
      "Apply fungicides containing carbendazim or hexaconazole as per local recommendations",
      "Improve soil drainage in the tea plantation",
      "Maintain balanced fertilization, avoiding excess nitrogen"
    ],
    irrigation: "Ensure good soil drainage. Avoid over-watering and water-logging conditions.",
    fertilizer: "Use a balanced fertilizer. Avoid excess nitrogen which can increase susceptibility.",
    pestManagement: "While not directly related to pests, maintain overall plant health to prevent secondary infections."
  },
  "healthy tea leaf": {
    treatment: [
      "Continue regular maintenance practices",
      "Monitor plants regularly for any signs of stress or disease",
      "Ensure proper nutrition and irrigation",
      "Maintain good air circulation and sunlight exposure in the tea garden"
    ],
    irrigation: "Maintain consistent soil moisture. Water deeply but less frequently to encourage deep root growth.",
    fertilizer: "Apply balanced fertilizer according to soil test recommendations and plant growth stage.",
    pestManagement: "Implement preventive measures. Regularly scout for pests and diseases."
  },
  "red leaf spot in tea": {
    treatment: [
      "Remove and destroy infected leaves",
      "Apply fungicides containing mancozeb or copper oxychloride as recommended",
      "Improve air circulation in the tea plantation",
      "Avoid working with tea plants when they're wet"
    ],
    irrigation: "Avoid overhead irrigation. Water early in the day so leaves can dry before evening.",
    fertilizer: "Ensure adequate potassium and calcium levels to strengthen plant cell walls.",
    pestManagement: "Monitor for sucking insects which can spread the disease. Use appropriate controls if necessary."
  }
};

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
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [predictionResult, setPredictionResult] = useState<{
    predicted_class: string;
    confidence_score: number;
  } | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

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
    setAnalysisComplete(false);
    const formData = new FormData();
    formData.append('image', imageFile);

    const startTime = Date.now();
    const animationDuration = 3000; // 3 seconds
    const animationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min((elapsedTime / animationDuration) * 100, 100);
      setLoadingProgress(progress);
      
      if (progress === 100) {
        clearInterval(animationInterval);
      }
    }, 30);

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
    } finally {
      const remainingTime = Math.max(0, animationDuration - (Date.now() - startTime));
      setTimeout(() => {
        clearInterval(animationInterval);
        setLoadingProgress(100);
        setIsAnalyzing(false);
        setAnalysisComplete(true);
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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 }}
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 }}
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <header className="bg-emerald-600 text-white py-4 px-6 flex items-center justify-between shadow-lg">
        <motion.div 
          className="flex items-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Leaf className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">CropAI</h1>
        </motion.div>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="hover:underline flex items-center transition-colors duration-200 hover:text-emerald-200">
            <Home className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200">
            Log Out
          </Button>
        </nav>
      </header>

      <motion.main
        className="flex-1 p-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.div variants={slideUp} className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-emerald-800">Welcome, {user?.displayName || 'Farmer'}!</h2>
          </motion.div>

          <motion.div variants={slideUp}>
            <Card className="bg-emerald-100 border-emerald-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">Crop Image Analysis</h3>
                <p className="text-emerald-700 mb-6">Upload or take a photo of your crops for instant analysis and recommendations.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Tooltip content="Upload an image from your device">
                    <Button 
                      className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                  </Tooltip>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Tooltip content="Take a photo using your device's camera">
                    <Button 
                      className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
                      onClick={handleCameraCapture}
                    >
                      <Camera className="mr-2 h-4 w-4" /> Take Photo
                    </Button>
                  </Tooltip>
                </div>
                
                <AnimatePresence>
                  {isCameraOpen && (
                    <motion.div 
                      className="mt-4 relative"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg shadow-md" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                        <Button onClick={capturePhoto} className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200">
                          <CameraIcon className="mr-2 h-4 w-4" /> Capture
                        </Button>
                        <Button onClick={switchCamera} className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200">
                          <SwitchCamera className="mr-2 h-4 w-4" /> Switch Camera
                        </Button>
                        <Button onClick={closeCamera} className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <canvas ref={canvasRef} className="hidden" />
                
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div 
                      className="mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-emerald-700 mb-2">Analyzing image...</p>
                      <div className="w-full bg-emerald-200 rounded-full h-2.5 mb-4">
                        <motion.div 
                          className="bg-emerald-600 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${loadingProgress}%` }}
                          transition={{ duration: 0.5 }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {previewUrl && (
                    <motion.div 
                      className="mt-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="max-w-md mx-auto">
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                          <img 
                            src={previewUrl} 
                            alt="Captured crop" 
                            className="w-full h-full object-contain" 
                          />
                        </div>  
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {analysisComplete && !isAnalyzing && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {['Disease Detection', 'Accuracy Score'].map((title) => (
                  <motion.div key={title} variants={slideUp}>
                    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4 text-emerald-800">{title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-emerald-600">
                            {title === 'Disease Detection' 
                              ? (predictionResult?.predicted_class || 'No Prediction')
                              : (predictionResult 
                                  ? `${Math.min((predictionResult.confidence_score * 100 + 50), 100).toFixed(2)}%` 
                                  : 'N/A'
                                )}
                          </span>
                          {title === 'Disease Detection' ? <Bug className="h-12 w-12 text-emerald-600" /> : <BarChart2 className="h-12 w-12 text-emerald-600" />}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={slideUp}>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Farming Recommendations</h3>
            {!analysisComplete ? (
              <p className="text-emerald-700 mb-6">Upload image first to continue.</p>
            ) : (
              <>
                {/* Treatment Steps */}
                {predictionResult?.predicted_class && diseaseCures[predictionResult.predicted_class as keyof typeof diseaseCures] && (
                  <motion.div 
                    variants={fadeIn}
                    className="mb-6"
                  >
                    <h4 className="text-xl font-semibold mb-3 text-emerald-800 flex items-center">
                      <Leaf className="mr-2 h-6 w-6 text-green-500" />
                      Treatment Steps
                    </h4>
                    <ul className="list-disc list-inside text-emerald-700 space-y-2">
                      {diseaseCures[predictionResult.predicted_class as keyof typeof diseaseCures].treatment.map((step, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {step}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <p className="text-emerald-700 mb-6">Get personalized recommendations to improve your crop health and yield.</p>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  variants={fadeIn}
                >
                  {['Irrigation Advice', 'Fertilizer Recommendations', 'Pest Management'].map((title) => (
                    <motion.div key={title} variants={slideUp}>
                      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-semibold mb-2 text-emerald-800 flex items-center">
                            {title === 'Irrigation Advice' && <Droplet className="mr-2 h-5 w-5 text-blue-500" />}
                            {title === 'Fertilizer Recommendations' && <Sprout className="mr-2 h-5 w-5 text-green-500" />}
                            {title === 'Pest Management' && <Bug className="mr-2 h-5 w-5 text-red-500" />}
                            {title}
                          </h4>
                          <p className="text-emerald-700 mb-4">
                            {predictionResult?.predicted_class && diseaseCures[predictionResult.predicted_class as keyof typeof diseaseCures]
                              ? (title === 'Irrigation Advice'
                                  ? diseaseCures[predictionResult.predicted_class as keyof typeof diseaseCures].irrigation
                                  : title === 'Fertilizer Recommendations'
                                  ? diseaseCures[predictionResult.predicted_class as keyof typeof diseaseCures].fertilizer
                                  : diseaseCures[predictionResult.predicted_class as keyof typeof diseaseCures].pestManagement)
                              : `Optimize your ${title.toLowerCase()} based on crop health and environmental data.`
                            }
                          </p>
                          
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
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
                <li><Link href="/" className="text-emerald-200 hover:text-white transition-colors duration-200">Home</Link></li>
                <li><Link href="/about" className="text-emerald-200 hover:text-white transition-colors duration-200">About Us</Link></li>
                <li><Link href="/contact" className="text-emerald-200 hover:text-white transition-colors duration-200">Contact</Link></li>
                <li><Link href="/termsNservice" className="text-emerald-200 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-emerald-200 hover:text-white transition-colors duration-200"><Facebook /></a>
                <a href="#" className="text-emerald-200 hover:text-white transition-colors duration-200"><Twitter /></a>
                <a href="#" className="text-emerald-200 hover:text-white transition-colors duration-200"><Instagram /></a>
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
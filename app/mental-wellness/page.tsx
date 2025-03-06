"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  Calendar, 
  Clock, 
  Download, 
  Heart, 
  LineChart, 
  Moon, 
  Play, 
  PauseCircle,
  RefreshCw, 
  Save, 
  Sun, 
  Volume2,
  Waves,
  Activity
} from "lucide-react";
import { useDrEcho } from "@/components/ai-assistant/dr-echo-context";
import { generateMentalWellnessResponse } from "@/lib/mentalWellnessRecommendations";
import { AnimatedHeart } from '@/components/ui/animated-heart';

// Function to render the floating heart icon
function FloatingHeartIcon() {
  return (
    <motion.div
      className="absolute right-8 top-24 z-10 hidden md:block"
      initial={{ y: 0 }}
      animate={{ y: [0, -15, 0] }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <AnimatedHeart 
        size={60} 
        color="rgba(255, 51, 102, 0.8)" 
        pulseColor="rgba(255, 102, 153, 0.8)"
      />
    </motion.div>
  );
}

export default function MentalWellnessPage() {
  const { openAssistant, sendMessage } = useDrEcho();
  const [activeTab, setActiveTab] = useState("assessment");
  const [moodScore, setMoodScore] = useState<number>(7);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [energyLevel, setEnergyLevel] = useState<number>(6);
  const [focusLevel, setFocusLevel] = useState<number>(7);
  const [journalEntry, setJournalEntry] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes in seconds
  const [remainingTime, setRemainingTime] = useState(300);
  const [selectedSound, setSelectedSound] = useState("rain");
  
  const moodLabels = {
    1: "Very Low",
    3: "Low",
    5: "Neutral",
    7: "Good",
    9: "Excellent"
  };
  
  const anxietyLabels = {
    1: "None",
    3: "Mild",
    5: "Moderate",
    7: "High",
    9: "Severe"
  };
  
  const sleepLabels = {
    1: "Poor",
    3: "Fair",
    5: "Average",
    7: "Good",
    9: "Excellent"
  };
  
  const energyLabels = {
    1: "Exhausted",
    3: "Tired",
    5: "Neutral",
    7: "Energetic",
    9: "Very Energetic"
  };
  
  const focusLabels = {
    1: "Distracted",
    3: "Somewhat Focused",
    5: "Moderately Focused",
    7: "Focused",
    9: "Highly Focused"
  };
  
  const getWellnessScore = () => {
    // Calculate overall wellness score (0-100)
    const moodWeight = 0.25;
    const anxietyWeight = 0.25;
    const sleepWeight = 0.2;
    const energyWeight = 0.15;
    const focusWeight = 0.15;
    
    // Normalize anxiety (lower is better)
    const normalizedAnxiety = 10 - anxietyLevel;
    
    const score = (
      (moodScore * moodWeight) +
      (normalizedAnxiety * anxietyWeight) +
      (sleepQuality * sleepWeight) +
      (energyLevel * energyWeight) +
      (focusLevel * focusWeight)
    ) * 10;
    
    return Math.round(score);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const toggleMeditation = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      
      // Simulate countdown
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return meditationTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  const resetMeditation = () => {
    setIsPlaying(false);
    setRemainingTime(meditationTime);
  };
  
  const setMeditationDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setMeditationTime(seconds);
    setRemainingTime(seconds);
  };
  
  const handleConsultAI = () => {
    // Prepare the message for the AI assistant
    const message = `
I'd like some mental wellness advice based on my current state:

Mood: ${moodScore}/10 (${Object.entries(moodLabels).find(([key]) => Number(key) === moodScore)?.[1] || 'N/A'})
Anxiety Level: ${anxietyLevel}/10 (${Object.entries(anxietyLabels).find(([key]) => Number(key) === anxietyLevel)?.[1] || 'N/A'})
Sleep Quality: ${sleepQuality}/10 (${Object.entries(sleepLabels).find(([key]) => Number(key) === sleepQuality)?.[1] || 'N/A'})
Energy Level: ${energyLevel}/10 (${Object.entries(energyLabels).find(([key]) => Number(key) === energyLevel)?.[1] || 'N/A'})
Focus Level: ${focusLevel}/10 (${Object.entries(focusLabels).find(([key]) => Number(key) === focusLevel)?.[1] || 'N/A'})

Journal Entry: ${journalEntry || 'No journal entry provided'}

Based on this information, could you provide some personalized mental wellness recommendations?
`;
    
    // Open the assistant first
    openAssistant();
    
    // Then send the message directly using the provider's sendMessage function
    // This bypasses the DOM manipulation which could be causing issues
    setTimeout(() => {
      sendMessage(message);
    }, 300);
  };
  
  const wellnessScore = getWellnessScore();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2">Mental Wellness</h1>
        <p className="text-muted-foreground mb-8">
          Track, assess, and improve your mental wellbeing
        </p>
      </motion.div>
      
      <FloatingHeartIcon />
      
      <Tabs defaultValue="assessment" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full mb-8">
          <TabsTrigger value="assessment" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Mood Journal
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center gap-1">
            <Waves className="h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessment">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        repeatType: "reverse"
                      }}
                    >
                      <Heart className="h-6 w-6 text-rose-500" />
                    </motion.div>
                    Daily Wellness Check-in
                  </CardTitle>
                  <CardDescription className="text-base">
                    Rate how you're feeling today to track your mental wellbeing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Mood Slider */}
                  <motion.div 
                    className="mood-metric-container relative space-y-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Sun className="h-5 w-5 text-yellow-500" />
                        Mood
                      </Label>
                      <motion.span 
                        className="text-sm font-medium px-3 py-1 rounded-full bg-blue-200 dark:bg-blue-800"
                        animate={{ 
                          backgroundColor: moodScore > 7 ? ["#bfdbfe", "#93c5fd", "#bfdbfe"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(moodLabels).find(([key]) => Number(key) === moodScore)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="mood-slider-container">
                      <div className="mood-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`mood-segment ${value <= moodScore ? 'active' : ''}`}
                            style={{ 
                              opacity: value <= moodScore ? (0.4 + (value / moodScore) * 0.6) : 0.2,
                              background: `linear-gradient(to right, rgba(59, 130, 246, ${value <= moodScore ? 0.7 : 0.2}), rgba(96, 165, 250, ${value <= moodScore ? 0.7 : 0.2}))`
                            }}
                            onClick={() => setMoodScore(value)}
                          />
                        ))}
                      </div>
                      <div 
                        className="slider-thumb-custom" 
                        style={{ left: `calc(${(moodScore - 1) * 10}% + ${moodScore * 0.5 - 0.5}%)` }}
                      />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={moodScore}
                        onChange={(e) => setMoodScore(parseInt(e.target.value))}
                        className="hidden-range-input"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Anxiety Slider */}
                  <motion.div 
                    className="anxiety-metric-container relative space-y-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-900/20 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-500" />
                        Anxiety Level
                      </Label>
                      <motion.span 
                        className="text-sm font-medium px-3 py-1 rounded-full bg-orange-200 dark:bg-orange-800"
                        animate={{ 
                          backgroundColor: anxietyLevel < 3 ? ["#fed7aa", "#fdba74", "#fed7aa"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(anxietyLabels).find(([key]) => Number(key) === anxietyLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="anxiety-slider-container">
                      <div className="anxiety-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`anxiety-segment ${value <= anxietyLevel ? 'active' : ''}`}
                            style={{ 
                              opacity: value <= anxietyLevel ? (0.4 + (value / anxietyLevel) * 0.6) : 0.2,
                              background: `linear-gradient(to right, rgba(249, 115, 22, ${value <= anxietyLevel ? 0.7 : 0.2}), rgba(251, 146, 60, ${value <= anxietyLevel ? 0.7 : 0.2}))`
                            }}
                            onClick={() => setAnxietyLevel(value)}
                          />
                        ))}
                      </div>
                      <div 
                        className="slider-thumb-custom anxiety-thumb" 
                        style={{ left: `calc(${(anxietyLevel - 1) * 10}% + ${anxietyLevel * 0.5 - 0.5}%)` }}
                      />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={anxietyLevel}
                        onChange={(e) => setAnxietyLevel(parseInt(e.target.value))}
                        className="hidden-range-input"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Sleep Quality Slider */}
                  <motion.div 
                    className="sleep-metric-container relative space-y-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-900/20 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Moon className="h-5 w-5 text-purple-500" />
                        Sleep Quality
                      </Label>
                      <motion.span 
                        className="text-sm font-medium px-3 py-1 rounded-full bg-purple-200 dark:bg-purple-800"
                        animate={{ 
                          backgroundColor: sleepQuality > 7 ? ["#e9d5ff", "#d8b4fe", "#e9d5ff"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(sleepLabels).find(([key]) => Number(key) === sleepQuality)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="sleep-slider-container">
                      <div className="sleep-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`sleep-segment ${value <= sleepQuality ? 'active' : ''}`}
                            style={{ 
                              opacity: value <= sleepQuality ? (0.4 + (value / sleepQuality) * 0.6) : 0.2,
                              background: `linear-gradient(to right, rgba(139, 92, 246, ${value <= sleepQuality ? 0.7 : 0.2}), rgba(167, 139, 250, ${value <= sleepQuality ? 0.7 : 0.2}))`
                            }}
                            onClick={() => setSleepQuality(value)}
                          />
                        ))}
                      </div>
                      <div 
                        className="slider-thumb-custom sleep-thumb" 
                        style={{ left: `calc(${(sleepQuality - 1) * 10}% + ${sleepQuality * 0.5 - 0.5}%)` }}
                      />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={sleepQuality}
                        onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                        className="hidden-range-input"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Energy Level Slider */}
                  <motion.div 
                    className="energy-metric-container relative space-y-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-yellow-950/30 dark:to-amber-900/20 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 text-yellow-500" />
                        Energy Level
                      </Label>
                      <motion.span 
                        className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-200 dark:bg-yellow-800"
                        animate={{ 
                          backgroundColor: energyLevel > 7 ? ["#fef08a", "#fde047", "#fef08a"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(energyLabels).find(([key]) => Number(key) === energyLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="energy-slider-container">
                      <div className="energy-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`energy-segment ${value <= energyLevel ? 'active' : ''}`}
                            style={{ 
                              opacity: value <= energyLevel ? (0.4 + (value / energyLevel) * 0.6) : 0.2,
                              background: `linear-gradient(to right, rgba(234, 179, 8, ${value <= energyLevel ? 0.7 : 0.2}), rgba(250, 204, 21, ${value <= energyLevel ? 0.7 : 0.2}))`
                            }}
                            onClick={() => setEnergyLevel(value)}
                          />
                        ))}
                      </div>
                      <div 
                        className="slider-thumb-custom energy-thumb" 
                        style={{ left: `calc(${(energyLevel - 1) * 10}% + ${energyLevel * 0.5 - 0.5}%)` }}
                      />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                        className="hidden-range-input"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Focus Level Slider */}
                  <motion.div 
                    className="focus-metric-container relative space-y-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/20 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-base flex items-center gap-2">
                        <Brain className="h-5 w-5 text-green-500" />
                        Focus Level
                      </Label>
                      <motion.span 
                        className="text-sm font-medium px-3 py-1 rounded-full bg-green-200 dark:bg-green-800"
                        animate={{ 
                          backgroundColor: focusLevel > 7 ? ["#bbf7d0", "#86efac", "#bbf7d0"] : undefined 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {Object.entries(focusLabels).find(([key]) => Number(key) === focusLevel)?.[1] || 'N/A'}
                      </motion.span>
                    </div>
                    <div className="focus-slider-container">
                      <div className="focus-indicator-segments">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                          <div 
                            key={value} 
                            className={`focus-segment ${value <= focusLevel ? 'active' : ''}`}
                            style={{ 
                              opacity: value <= focusLevel ? (0.4 + (value / focusLevel) * 0.6) : 0.2,
                              background: `linear-gradient(to right, rgba(34, 197, 94, ${value <= focusLevel ? 0.7 : 0.2}), rgba(74, 222, 128, ${value <= focusLevel ? 0.7 : 0.2}))`
                            }}
                            onClick={() => setFocusLevel(value)}
                          />
                        ))}
                      </div>
                      <div 
                        className="slider-thumb-custom focus-thumb" 
                        style={{ left: `calc(${(focusLevel - 1) * 10}% + ${focusLevel * 0.5 - 0.5}%)` }}
                      />
                      <input 
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={focusLevel}
                        onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                        className="hidden-range-input"
                      />
                    </div>
                  </motion.div>
                  
                  <div className="wellness-activity-tracker mt-8 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-950/30 dark:to-gray-900/20 shadow-sm">
                    <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-sky-500" />
                      Activities That Influenced Your Mood Today
                    </h3>
                    <div className="activities-grid grid grid-cols-2 gap-2 md:grid-cols-3">
                      {["Exercise", "Meditation", "Good Sleep", "Social Time", "Hobbies", "Work", "Study", "Screen Time", "Nature Time"].map((activity) => (
                        <div key={activity} className="activity-item">
                          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                            <span className="text-sm">{activity}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <motion.div 
                    className="flex justify-end space-x-2"
                    whileInView={{ opacity: [0, 1], y: [20, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setMoodScore(7);
                        setAnxietyLevel(3);
                        setSleepQuality(8);
                        setEnergyLevel(6);
                        setFocusLevel(7);
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Check-in
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="wellness-score-card overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800/20">
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="relative"
                    >
                      <Heart className="h-5 w-5 text-pink-500" />
                    </motion.div>
                    Wellness Score
                  </CardTitle>
                  <CardDescription>
                    Your overall mental wellness rating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative h-44 w-44">
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <motion.div 
                          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [0.8, 1.1, 1] }}
                          transition={{ duration: 1.5, delay: 0.2 }}
                        >
                          {wellnessScore}
                        </motion.div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">out of 100</div>
                      </div>
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        {/* Gradient background for the ring */}
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={wellnessScore >= 80 ? "#4ade80" : wellnessScore >= 60 ? "#60a5fa" : wellnessScore >= 40 ? "#facc15" : "#f87171"} />
                            <stop offset="100%" stopColor={wellnessScore >= 80 ? "#22c55e" : wellnessScore >= 60 ? "#3b82f6" : wellnessScore >= 40 ? "#eab308" : "#ef4444"} />
                          </linearGradient>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        
                        {/* Background ring */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(203, 213, 225, 0.3)"
                          strokeWidth="10"
                          className="dark:opacity-30"
                        />
                        
                        {/* Score ring with gradient and animation */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="10"
                          strokeDasharray={`${(wellnessScore / 100) * 283} 283`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                          filter="url(#glow)"
                          initial={{ strokeDasharray: "0 283" }}
                          animate={{ strokeDasharray: `${(wellnessScore / 100) * 283} 283` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                    </div>
                    <motion.div 
                      className="wellness-rating-badge mt-2 px-4 py-1 rounded-full text-white font-medium text-sm"
                      style={{ 
                        background: `linear-gradient(to right, ${
                          wellnessScore >= 80 ? "#4ade80, #22c55e" : 
                          wellnessScore >= 60 ? "#60a5fa, #3b82f6" : 
                          wellnessScore >= 40 ? "#facc15, #eab308" : 
                          "#f87171, #ef4444"
                        })`
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      {wellnessScore >= 80 ? "Excellent" : 
                       wellnessScore >= 60 ? "Good" : 
                       wellnessScore >= 40 ? "Fair" : 
                       "Needs Attention"}
                    </motion.div>
                  </motion.div>
                  
                  <div className="space-y-3 wellness-stats mt-4">
                    <motion.div 
                      className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/10"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(219, 234, 254, 0.8)" }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Last check-in</span>
                      </div>
                      <span className="font-medium text-sm">Today, 9:41 AM</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(209, 250, 229, 0.8)" }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-green-500" />
                        <span className="text-sm">7-day trend</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.div 
                          initial={{ y: 0 }}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3L20 13H4L12 3Z" fill="#22c55e" />
                          </svg>
                        </motion.div>
                        <span className="font-medium text-sm text-green-600 dark:text-green-400">+5 points</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="wellness-recommendation mt-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Based on your patterns:</p>
                    <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/10 border border-purple-100 dark:border-purple-900/20">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Tip:</span> Your mood is typically highest in the morning. Consider scheduling important activities during this time.
                      </p>
                    </div>
                  </motion.div>
                  
                  <Button 
                    onClick={handleConsultAI} 
                    className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md"
                  >
                    <motion.div
                      className="mr-2 h-5 w-5"
                      animate={{ rotateY: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="h-5 w-5" />
                    </motion.div>
                    Get AI Recommendations
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("meditation")}>
                    <Waves className="mr-2 h-4 w-4" />
                    Start Meditation
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("journal")}>
                    <LineChart className="mr-2 h-4 w-4" />
                    Write in Journal
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Therapy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="journal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mood Journal</CardTitle>
                  <CardDescription>
                    Express your thoughts and feelings to track your emotional wellbeing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>How are you feeling today?</Label>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <Sun className="h-5 w-5 text-warning mr-2" />
                        <span className="text-sm">Morning</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <Textarea 
                      placeholder="Write about your thoughts, feelings, and experiences..." 
                      className="min-h-[200px]"
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Mood Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Happy", "Calm", "Anxious", "Sad", "Energetic", "Tired", "Stressed", "Grateful", "Frustrated", "Hopeful"].map((tag) => (
                        <Button key={tag} variant="outline" size="sm" className="rounded-full">
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Save Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Journal History</CardTitle>
                  <CardDescription>
                    Your recent journal entries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { date: "Yesterday", time: "9:30 PM", mood: "Calm", preview: "Today was a productive day at work. I managed to..." },
                      { date: "May 10, 2025", time: "8:15 AM", mood: "Anxious", preview: "Feeling a bit nervous about the presentation today..." },
                      { date: "May 8, 2025", time: "10:45 PM", mood: "Happy", preview: "Had a wonderful dinner with friends. We talked about..." },
                    ].map((entry, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{entry.date}</span>
                          <span className="text-xs text-muted-foreground">{entry.time}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          <span className="text-xs">{entry.mood}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{entry.preview}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full">View All Entries</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="meditation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Guided Meditation</CardTitle>
                  <CardDescription>
                    Take a moment to relax and focus on your breathing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex flex-col items-center">
                    <div className="relative h-64 w-64">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-bold">{formatTime(remainingTime)}</div>
                      </div>
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset={`${(1 - remainingTime / meditationTime) * 283}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      
                      {/* Breathing animation */}
                      {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-32 w-32 rounded-full bg-primary/10 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="icon" onClick={resetMeditation}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button size="lg" onClick={toggleMeditation}>
                      {isPlaying ? (
                        <>
                          <PauseCircle className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Duration</Label>
                    <div className="flex justify-between gap-4">
                      {[1, 3, 5, 10, 15, 20].map((minutes) => (
                        <Button 
                          key={minutes} 
                          variant={meditationTime === minutes * 60 ? "default" : "outline"}
                          onClick={() => setMeditationDuration(minutes)}
                          className="flex-1"
                        >
                          {minutes} min
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Ambient Sound</Label>
                    <RadioGroup value={selectedSound} onValueChange={setSelectedSound} className="grid grid-cols-2 gap-4">
                      <div>
                        <RadioGroupItem value="rain" id="rain" className="peer sr-only" />
                        <Label
                          htmlFor="rain"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Waves className="mb-3 h-6 w-6" />
                          Rain
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="forest" id="forest" className="peer sr-only" />
                        <Label
                          htmlFor="forest"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Waves className="mb-3 h-6 w-6" />
                          Forest
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="ocean" id="ocean" className="peer sr-only" />
                        <Label
                          htmlFor="ocean"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Waves className="mb-3 h-6 w-6" />
                          Ocean
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="white-noise" id="white-noise" className="peer sr-only" />
                        <Label
                          htmlFor="white-noise"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Volume2 className="mb-3 h-6 w-6" />
                          White Noise
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meditation Stats</CardTitle>
                  <CardDescription>
                    Your meditation journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">This Week</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total Minutes</p>
                      <p className="text-2xl font-bold">187</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Longest Streak</p>
                      <p className="text-2xl font-bold">5 days</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current streak</span>
                      <span className="font-medium">2 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last session</span>
                      <span className="font-medium">Yesterday</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Stress Relief", duration: "10 min", type: "Guided" },
                    { title: "Better Sleep", duration: "15 min", type: "Guided" },
                    { title: "Focus & Concentration", duration: "5 min", type: "Unguided" },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{session.duration}</span>
                          <span className="mx-2">•</span>
                          <span>{session.type}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wellness Trends</CardTitle>
                  <CardDescription>
                    Your mental wellness patterns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Wellness trend chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Mood Patterns</CardTitle>
                  <CardDescription>
                    Insights into your emotional patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Weekly Mood Distribution</h3>
                      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Mood distribution chart will appear here</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Time of Day Analysis</h3>
                      <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Time of day chart will appear here</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Key Insights</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Sun className="h-3 w-3 text-primary" />
                        </div>
                        <p className="text-sm">Your mood tends to be highest in the morning and gradually decreases throughout the day.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Moon className="h-3 w-3 text-primary" />
                        </div>
                        <p className="text-sm">Sleep quality has a strong correlation with your anxiety levels the following day.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Calendar className="h-3 w-3 text-primary" />
                        </div>
                        <p className="text-sm">Wednesdays tend to be your most stressful day of the week based on your check-in data.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wellness Summary</CardTitle>
                  <CardDescription>
                    Your mental wellness at a glance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Overall Wellness</Label>
                      <span className="text-sm font-medium">{wellnessScore}%</span>
                    </div>
                    <Progress value={wellnessScore} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <Label>Mood Stability</Label>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <Label>Stress Management</Label>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <Label>Sleep Quality</Label>
                      <span className="text-sm font-medium">{sleepQuality * 10}%</span>
                    </div>
                    <Progress value={sleepQuality * 10} className="h-2" />
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="font-medium mb-2">Recommendations</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Waves className="h-3 w-3 text-primary" />
                        </div>
                        <span>Try a 10-minute meditation before bed to improve sleep quality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Sun className="h-3 w-3 text-primary" />
                        </div>
                        <span>Morning walks can help maintain your positive morning mood throughout the day</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <LineChart className="h-3 w-3 text-primary" />
                        </div>
                        <span>Journal more consistently to better track mood patterns</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Managing Workplace Stress", type: "Article", time: "5 min read" },
                    { title: "Sleep Hygiene Basics", type: "Video", time: "8 min" },
                    { title: "Mindfulness for Beginners", type: "Guide", time: "10 min read" },
                  ].map((resource, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{resource.type}</span>
                          <span className="mx-2">•</span>
                          <span>{resource.time}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">Browse All Resources</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
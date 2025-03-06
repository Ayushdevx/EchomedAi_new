"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Play, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function RecordingInterface() {
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded" | "analyzing">("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const startRecording = () => {
    setRecordingState("recording");
    setRecordingTime(0);
    
    // Simulate recording time progress
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          clearInterval(interval);
          setRecordingState("recorded");
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };
  
  const stopRecording = () => {
    setRecordingState("recorded");
  };
  
  const analyzeRecording = () => {
    setRecordingState("analyzing");
    setProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // In a real app, this would trigger the display of results
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  const resetRecording = () => {
    setRecordingState("idle");
    setRecordingTime(0);
    setProgress(0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Health Sounds</CardTitle>
        <CardDescription>
          Capture heart or lung sounds for AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-48 rounded-lg bg-muted ecg-grid flex items-center justify-center relative overflow-hidden">
          {recordingState === "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Mic className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Ready to record</p>
            </motion.div>
          )}
          
          {recordingState === "recording" && (
            <div className="w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center pulse-animation">
                  <div className="h-12 w-12 rounded-full bg-destructive/30 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center">
                      <Mic className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <svg className="waveform-line" viewBox="0 0 1000 200" preserveAspectRatio="none">
                <path
                  d="M0,100 Q25,90 50,100 T100,110 T150,90 T200,80 T250,100 T300,120 T350,90 T400,70 T450,110 T500,130 T550,90 T600,80 T650,100 T700,120 T750,90 T800,70 T850,110 T900,100 T950,90 T1000,100"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          )}
          
          {recordingState === "recorded" && (
            <div className="w-full h-full">
              <svg className="waveform-line" viewBox="0 0 1000 200" preserveAspectRatio="none">
                <path
                  d="M0,100 Q25,90 50,100 T100,110 T150,90 T200,80 T250,100 T300,120 T350,90 T400,70 T450,110 T500,130 T550,90 T600,80 T650,100 T700,120 T750,90 T800,70 T850,110 T900,100 T950,90 T1000,100"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-md px-3 py-1 text-sm flex items-center">
                <Play className="h-3 w-3 mr-1" />
                <span>30 seconds</span>
              </div>
            </div>
          )}
          
          {recordingState === "analyzing" && (
            <div className="text-center">
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-2" />
              <p className="text-muted-foreground">Analyzing recording...</p>
              <div className="max-w-xs mx-auto mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {recordingState === "recording" && (
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse mr-2" />
                <span className="text-sm font-medium">Recording: {recordingTime}s</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {recordingState === "idle" && (
              <Button onClick={startRecording}>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}
            
            {recordingState === "recording" && (
              <Button variant="destructive" onClick={stopRecording}>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
            
            {recordingState === "recorded" && (
              <>
                <Button variant="outline" onClick={resetRecording}>
                  Reset
                </Button>
                <Button onClick={analyzeRecording}>
                  Analyze Recording
                </Button>
              </>
            )}
            
            {recordingState === "analyzing" && (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
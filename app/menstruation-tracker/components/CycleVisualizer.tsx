import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface CycleVisualizerProps {
  cycleLength: number;
  currentDay: number;
  lastPeriodStart: Date | null;
}

interface PhaseInfo {
  name: string;
  description: string;
  color: string;
  duration: [number, number];
  symptoms: string[];
}

const cyclePhases: PhaseInfo[] = [
  {
    name: "Menstrual Phase",
    description: "The uterine lining is shed, resulting in menstrual bleeding",
    color: "rgb(244, 63, 94)",
    duration: [1, 5],
    symptoms: ["Cramps", "Fatigue", "Mood changes"],
  },
  {
    name: "Follicular Phase",
    description: "Follicles in the ovary develop and estrogen levels rise",
    color: "rgb(251, 146, 60)",
    duration: [6, 13],
    symptoms: ["Increased energy", "Improved mood", "Skin clarity"],
  },
  {
    name: "Ovulation Phase",
    description: "A mature egg is released from the ovary",
    color: "rgb(34, 197, 94)",
    duration: [14, 16],
    symptoms: ["Mild cramping", "Increased libido", "Clear discharge"],
  },
  {
    name: "Luteal Phase",
    description: "The body prepares for possible pregnancy",
    color: "rgb(147, 51, 234)",
    duration: [17, 28],
    symptoms: ["Breast tenderness", "Bloating", "Mood changes"],
  },
];

export default function CycleVisualizer({
  cycleLength,
  currentDay,
  lastPeriodStart,
}: CycleVisualizerProps) {
  const [selectedPhase, setSelectedPhase] = useState<PhaseInfo | null>(null);
  const [currentPhase, setCurrentPhase] = useState<PhaseInfo | null>(null);

  useEffect(() => {
    if (currentDay) {
      const phase = cyclePhases.find(
        (phase) => currentDay >= phase.duration[0] && currentDay <= phase.duration[1]
      );
      setCurrentPhase(phase || null);
    }
  }, [currentDay]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cycle Phase Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative h-[300px] w-full">
          {/* Circular visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[250px] h-[250px]">
              {cyclePhases.map((phase, index) => {
                const rotation = (index * 360) / cyclePhases.length;
                const isSelected = selectedPhase?.name === phase.name;
                const isActive = currentPhase?.name === phase.name;

                return (
                  <motion.div
                    key={phase.name}
                    className="absolute inset-0"
                    style={{
                      rotate: rotation,
                      transformOrigin: "center",
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="absolute inset-0 cursor-pointer"
                      style={{
                        background: `conic-gradient(${phase.color} 0deg, ${phase.color} 90deg, transparent 90deg)`,
                        opacity: isSelected || isActive ? 1 : 0.7,
                      }}
                      onClick={() => setSelectedPhase(phase)}
                      whileHover={{ opacity: 0.9 }}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                );
              })}
              {/* Center circle with current day */}
              <motion.div
                className="absolute inset-0 m-auto w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentDay}</div>
                  <div className="text-xs text-muted-foreground">Day</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Phase information */}
        <AnimatePresence mode="wait">
          {(selectedPhase || currentPhase) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 p-4 rounded-lg border"
              key={(selectedPhase || currentPhase)?.name}
            >
              <h3 className="text-lg font-semibold" style={{ color: (selectedPhase || currentPhase)?.color }}>
                {(selectedPhase || currentPhase)?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {(selectedPhase || currentPhase)?.description}
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Common Symptoms:</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-4">
                  {(selectedPhase || currentPhase)?.symptoms.map((symptom) => (
                    <li key={symptom}>{symptom}</li>
                  ))}
                </ul>
              </div>
              <div className="text-sm text-muted-foreground">
                Days {(selectedPhase || currentPhase)?.duration[0]} -{" "}
                {(selectedPhase || currentPhase)?.duration[1]} of cycle
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
} 
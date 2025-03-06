import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SymptomsTrackerProps {
  onSymptomsChange: (symptoms: string[]) => void;
  selectedSymptoms: string[];
}

const commonSymptoms = [
  "Cramps",
  "Headache",
  "Bloating",
  "Fatigue",
  "Breast Tenderness",
  "Mood Swings",
  "Back Pain",
  "Nausea",
  "Acne",
  "Food Cravings",
];

export default function SymptomsTracker({
  onSymptomsChange,
  selectedSymptoms,
}: SymptomsTrackerProps) {
  const handleSymptomToggle = (symptom: string) => {
    const updatedSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter((s) => s !== symptom)
      : [...selectedSymptoms, symptom];
    onSymptomsChange(updatedSymptoms);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptoms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {commonSymptoms.map((symptom) => (
            <div key={symptom} className="flex items-center space-x-2">
              <Checkbox
                id={symptom}
                checked={selectedSymptoms.includes(symptom)}
                onCheckedChange={() => handleSymptomToggle(symptom)}
              />
              <Label htmlFor={symptom}>{symptom}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
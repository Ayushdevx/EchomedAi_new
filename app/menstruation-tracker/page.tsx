"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymptomsTracker from "./components/SymptomsTracker";
import CycleVisualizer from "./components/CycleVisualizer";
import ClinicLocator from "./components/ClinicLocator";

interface CycleDay {
  date: Date;
  flow: "light" | "medium" | "heavy";
  symptoms: string[];
  painLevel: number;
  mood: string;
}

export default function MenstruationTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [cycleDays, setCycleDays] = useState<CycleDay[]>([]);
  const [painLevel, setPainLevel] = useState<number>(0);
  const [flow, setFlow] = useState<"light" | "medium" | "heavy">("medium");
  const [mood, setMood] = useState<string>("normal");
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [lastPeriodStart, setLastPeriodStart] = useState<Date | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [currentCycleDay, setCurrentCycleDay] = useState<number>(1);

  useEffect(() => {
    if (lastPeriodStart) {
      const today = new Date();
      const daysSinceStart = Math.floor(
        (today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      const currentDay = (daysSinceStart % cycleLength) + 1;
      setCurrentCycleDay(currentDay);
    }
  }, [lastPeriodStart, cycleLength]);

  const calculateFertilityWindow = () => {
    if (!lastPeriodStart) return null;
    
    const ovulationDay = new Date(lastPeriodStart);
    ovulationDay.setDate(lastPeriodStart.getDate() + Math.floor(cycleLength / 2) - 14);
    
    const fertilityStart = new Date(ovulationDay);
    fertilityStart.setDate(ovulationDay.getDate() - 5);
    
    const fertilityEnd = new Date(ovulationDay);
    fertilityEnd.setDate(ovulationDay.getDate() + 1);
    
    return {
      ovulationDay,
      fertilityStart,
      fertilityEnd,
    };
  };

  const addCycleDay = () => {
    const newDay: CycleDay = {
      date: selectedDate,
      flow,
      symptoms: selectedSymptoms,
      painLevel,
      mood,
    };

    setCycleDays([...cycleDays, newDay]);
    if (!lastPeriodStart) {
      setLastPeriodStart(selectedDate);
    }

    // Reset form
    setPainLevel(0);
    setFlow("medium");
    setMood("normal");
    setSelectedSymptoms([]);
  };

  const getDateHighlight = (date: Date) => {
    const cycleDay = cycleDays.find(
      (day) => day.date.toDateString() === date.toDateString()
    );
    
    if (cycleDay) {
      return {
        flow: cycleDay.flow,
        painLevel: cycleDay.painLevel,
        mood: cycleDay.mood,
      };
    }
    
    const fertility = calculateFertilityWindow();
    if (fertility) {
      const dateStr = date.toDateString();
      if (dateStr === fertility.ovulationDay.toDateString()) {
        return { type: "ovulation" };
      }
      if (
        date >= fertility.fertilityStart &&
        date <= fertility.fertilityEnd
      ) {
        return { type: "fertile" };
      }
    }
    
    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary mb-8">
        Menstruation Cycle Tracker
      </h1>

      <Tabs defaultValue="daily-log" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily-log">Daily Log</TabsTrigger>
          <TabsTrigger value="cycle-view">Cycle View</TabsTrigger>
          <TabsTrigger value="find-care">Find Care</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-log" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  modifiers={{
                    highlighted: (date) => getDateHighlight(date) !== null,
                  }}
                  modifiersClassNames={{
                    highlighted: "bg-primary/10",
                  }}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Flow Intensity</label>
                    <Select value={flow} onValueChange={(value: any) => setFlow(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select flow intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pain Level (0-10)</label>
                    <Slider
                      value={[painLevel]}
                      onValueChange={(value) => setPainLevel(value[0])}
                      max={10}
                      step={1}
                    />
                    <div className="text-sm text-muted-foreground">
                      Current: {painLevel}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mood</label>
                    <Select value={mood} onValueChange={(value) => setMood(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="happy">Happy</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="sad">Sad</SelectItem>
                        <SelectItem value="irritated">Irritated</SelectItem>
                        <SelectItem value="anxious">Anxious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={addCycleDay} className="w-full">
                    Log Day
                  </Button>
                </CardContent>
              </Card>

              <SymptomsTracker
                selectedSymptoms={selectedSymptoms}
                onSymptomsChange={setSelectedSymptoms}
              />
            </div>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Cycle Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Cycle Length</h3>
                    <div className="flex items-center space-x-2">
                      <Progress value={(cycleLength / 35) * 100} />
                      <span>{cycleLength} days</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Fertility Window</h3>
                    {calculateFertilityWindow() ? (
                      <Badge variant="secondary">
                        {calculateFertilityWindow()?.fertilityStart.toLocaleDateString()} -{" "}
                        {calculateFertilityWindow()?.fertilityEnd.toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Log your period to see predictions</Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Next Period</h3>
                    {lastPeriodStart ? (
                      <Badge variant="secondary">
                        {new Date(
                          lastPeriodStart.getTime() + cycleLength * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Log your period to see predictions</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cycle-view">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CycleVisualizer
              cycleLength={cycleLength}
              currentDay={currentCycleDay}
              lastPeriodStart={lastPeriodStart}
            />
            <Card>
              <CardHeader>
                <CardTitle>Cycle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Cycle Length (days)</label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[cycleLength]}
                        onValueChange={(value) => setCycleLength(value[0])}
                        min={21}
                        max={35}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm">{cycleLength}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Current Cycle Day</h3>
                    <Badge variant="secondary" className="text-lg">
                      Day {currentCycleDay}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Last Period Start</h3>
                    {lastPeriodStart ? (
                      <Badge variant="secondary">
                        {lastPeriodStart.toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not set</Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Next Period</h3>
                    {lastPeriodStart ? (
                      <Badge variant="secondary">
                        {new Date(
                          lastPeriodStart.getTime() + cycleLength * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Log your period to see prediction</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
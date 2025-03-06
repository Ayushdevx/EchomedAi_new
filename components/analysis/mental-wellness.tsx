"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sun,
  Moon,
  Brain,
  Heart,
  Coffee,
  Book,
  Music,
  Users,
  Activity
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MoodEntry {
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  activities: string[];
  triggers: string[];
  notes: string;
}

interface InsightMetrics {
  averageMood: number;
  moodTrend: 'up' | 'down' | 'stable';
  sleepQuality: number;
  energyLevel: number;
  topTriggers: string[];
  helpfulActivities: string[];
}

const MentalWellness: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [activeTab, setActiveTab] = useState<'trends' | 'patterns' | 'insights'>('trends');

  // Mock data generation
  const generateMockData = (): MoodEntry[] => {
    const data: MoodEntry[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        mood: Math.random() * 4 + 1,
        energy: Math.random() * 4 + 1,
        sleep: Math.random() * 4 + 1,
        activities: ['Exercise', 'Reading', 'Meditation'].filter(() => Math.random() > 0.5),
        triggers: ['Work Stress', 'Social Events', 'Weather'].filter(() => Math.random() > 0.5),
        notes: ''
      });
    }
    
    return data;
  };

  const moodData = generateMockData();

  const generateInsights = (data: MoodEntry[]): InsightMetrics => {
    const avgMood = data.reduce((sum, entry) => sum + entry.mood, 0) / data.length;
    const moodStart = data[0].mood;
    const moodEnd = data[data.length - 1].mood;
    
    return {
      averageMood: avgMood,
      moodTrend: moodEnd > moodStart ? 'up' : moodEnd < moodStart ? 'down' : 'stable',
      sleepQuality: data.reduce((sum, entry) => sum + entry.sleep, 0) / data.length,
      energyLevel: data.reduce((sum, entry) => sum + entry.energy, 0) / data.length,
      topTriggers: ['Work Stress', 'Social Events'],
      helpfulActivities: ['Exercise', 'Meditation']
    };
  };

  const insights = generateInsights(moodData);

  const lineChartData = {
    labels: moodData.map(entry => entry.date),
    datasets: [
      {
        label: 'Mood',
        data: moodData.map(entry => entry.mood),
        borderColor: 'hsl(142, 100%, 50%)',
        backgroundColor: 'hsla(142, 100%, 50%, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Energy',
        data: moodData.map(entry => entry.energy),
        borderColor: 'hsl(38, 95%, 50%)',
        backgroundColor: 'hsla(38, 95%, 50%, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Sleep',
        data: moodData.map(entry => entry.sleep),
        borderColor: 'hsl(262, 100%, 70%)',
        backgroundColor: 'hsla(262, 100%, 70%, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Energy Level',
        data: moodData.map(entry => entry.energy),
        backgroundColor: [
          'hsla(142, 100%, 50%, 0.7)',
          'hsla(38, 95%, 50%, 0.7)',
          'hsla(262, 100%, 70%, 0.7)',
          'hsla(199, 100%, 60%, 0.7)',
          'hsla(326, 100%, 65%, 0.7)',
          'hsla(16, 100%, 65%, 0.7)',
          'hsla(169, 100%, 45%, 0.7)'
        ],
        borderColor: [
          'hsl(142, 100%, 50%)',
          'hsl(38, 95%, 50%)',
          'hsl(262, 100%, 70%)',
          'hsl(199, 100%, 60%)',
          'hsl(326, 100%, 65%)',
          'hsl(16, 100%, 65%)',
          'hsl(169, 100%, 45%)'
        ],
        borderWidth: 1
      }
    ]
  };

  const radarChartData = {
    labels: ['Mood', 'Energy', 'Sleep', 'Social', 'Focus', 'Motivation'],
    datasets: [
      {
        label: 'Current',
        data: [4, 3.5, 4, 3, 3.5, 4],
        backgroundColor: 'hsla(142, 100%, 50%, 0.2)',
        borderColor: 'hsl(142, 100%, 50%)',
        borderWidth: 1
      },
      {
        label: 'Previous',
        data: [3, 4, 3.5, 3.5, 3, 3.5],
        backgroundColor: 'hsla(262, 100%, 70%, 0.2)',
        borderColor: 'hsl(262, 100%, 70%)',
        borderWidth: 1
      }
    ]
  };

  const doughnutChartData = {
    labels: ['Exercise', 'Meditation', 'Reading', 'Social', 'Work', 'Rest'],
    datasets: [{
      data: [30, 20, 15, 12, 15, 8],
      backgroundColor: [
        'hsla(142, 100%, 50%, 0.7)',
        'hsla(262, 100%, 70%, 0.7)',
        'hsla(199, 100%, 60%, 0.7)',
        'hsla(38, 95%, 50%, 0.7)',
        'hsla(326, 100%, 65%, 0.7)',
        'hsla(169, 100%, 45%, 0.7)'
      ],
      borderColor: [
        'hsl(142, 100%, 50%)',
        'hsl(262, 100%, 70%)',
        'hsl(199, 100%, 60%)',
        'hsl(38, 95%, 50%)',
        'hsl(326, 100%, 65%)',
        'hsl(169, 100%, 45%)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="mental-wellness">
      <div className="wellness-header">
        <div className="header-content">
          <h1>Mental Wellness Tracker</h1>
          <p>Track your mood patterns and discover insights</p>
        </div>
        <div className="time-range-selector">
          <button
            className={`range-button ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`range-button ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`range-button ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          <Activity size={20} />
          Trends
        </button>
        <button
          className={`tab-button ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <Brain size={20} />
          Patterns
        </button>
        <button
          className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <Heart size={20} />
          Insights
        </button>
      </div>

      {activeTab === 'trends' && (
        <div className="trends-section">
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-title">
                <span className="metric-mood">Mood</span>
                <div className="status-tag good">Good</div>
              </div>
              <div className="slider-container">
                <input 
                  type="range" 
                  className="metric-slider mood-slider" 
                  min="0" 
                  max="100" 
                  value="84"
                  readOnly
                />
                <div className="slider-track mood-track" style={{ background: 'linear-gradient(to right, rgb(77, 148, 255, 0.2), rgb(77, 148, 255))' }}></div>
                <div className="slider-thumb" style={{ left: '84%', background: 'rgb(77, 148, 255)' }}></div>
              </div>
              <div className="metric-scale">
                <span className="metric-mood">Very Low</span>
                <span className="metric-mood">Neutral</span>
                <span className="metric-mood">Excellent</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-title">
                <span className="metric-anxiety">Anxiety Level</span>
                <div className="status-tag mild">Mild</div>
              </div>
              <div className="slider-container">
                <input 
                  type="range" 
                  className="metric-slider anxiety-slider" 
                  min="0" 
                  max="100" 
                  value="35"
                  readOnly
                />
                <div className="slider-track anxiety-track" style={{ background: 'linear-gradient(to right, rgb(255, 122, 0, 0.2), rgb(255, 122, 0))' }}></div>
                <div className="slider-thumb" style={{ left: '35%', background: 'rgb(255, 122, 0)' }}></div>
              </div>
              <div className="metric-scale">
                <span className="metric-anxiety">None</span>
                <span className="metric-anxiety">Moderate</span>
                <span className="metric-anxiety">Severe</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-title">
                <span className="metric-sleep">Sleep Quality</span>
                <div className="status-tag na">N/A</div>
              </div>
              <div className="slider-container">
                <input 
                  type="range" 
                  className="metric-slider sleep-slider" 
                  min="0" 
                  max="100" 
                  value="90"
                  readOnly
                />
                <div className="slider-track sleep-track" style={{ background: 'linear-gradient(to right, rgb(138, 43, 226, 0.2), rgb(138, 43, 226))' }}></div>
                <div className="slider-thumb" style={{ left: '90%', background: 'rgb(138, 43, 226)' }}></div>
              </div>
              <div className="metric-scale">
                <span className="metric-sleep">Poor</span>
                <span className="metric-sleep">Average</span>
                <span className="metric-sleep">Excellent</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-title">
                <span className="metric-energy">Energy Level</span>
                <div className="status-tag neutral">Moderate</div>
              </div>
              <div className="slider-container">
                <input 
                  type="range" 
                  className="metric-slider energy-slider" 
                  min="0" 
                  max="100" 
                  value="65"
                  readOnly
                />
                <div className="slider-track energy-track" style={{ background: 'linear-gradient(to right, rgb(255, 193, 7, 0.2), rgb(255, 193, 7))' }}></div>
                <div className="slider-thumb" style={{ left: '65%', background: 'rgb(255, 193, 7)' }}></div>
              </div>
              <div className="metric-scale">
                <span className="metric-energy">Exhausted</span>
                <span className="metric-energy">Neutral</span>
                <span className="metric-energy">Very Energetic</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-title">
                <span className="metric-focus">Focus Level</span>
                <div className="status-tag good">Focused</div>
              </div>
              <div className="slider-container">
                <input 
                  type="range" 
                  className="metric-slider focus-slider" 
                  min="0" 
                  max="100" 
                  value="80"
                  readOnly
                />
                <div className="slider-track focus-track" style={{ background: 'linear-gradient(to right, rgb(0, 200, 83, 0.2), rgb(0, 200, 83))' }}></div>
                <div className="slider-thumb" style={{ left: '80%', background: 'rgb(0, 200, 83)' }}></div>
              </div>
              <div className="metric-scale">
                <span className="metric-focus">Distracted</span>
                <span className="metric-focus">Moderate</span>
                <span className="metric-focus">Highly Focused</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Mood, Energy & Sleep Trends</h3>
            <div className="chart-container">
              <Line data={lineChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: 'hsl(var(--primary))',
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  }
                },
                scales: {
                  y: {
                    min: 0,
                    max: 5,
                    grid: {
                      color: 'hsl(var(--primary)/0.1)'
                    },
                    ticks: {
                      color: 'hsl(var(--primary)/0.7)'
                    }
                  },
                  x: {
                    grid: {
                      color: 'hsl(var(--primary)/0.1)'
                    },
                    ticks: {
                      color: 'hsl(var(--primary)/0.7)'
                    }
                  }
                }
              }} />
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3>Daily Energy Distribution</h3>
              <div className="chart-container">
                <Bar data={barChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 5,
                      grid: {
                        color: 'hsl(var(--primary)/0.1)'
                      },
                      ticks: {
                        color: 'hsl(var(--primary)/0.7)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: 'hsl(var(--primary)/0.7)'
                      }
                    }
                  }
                }} />
              </div>
            </div>

            <div className="chart-card">
              <h3>Activity Distribution</h3>
              <div className="chart-container">
                <Doughnut data={doughnutChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right',
                      labels: {
                        color: 'hsl(var(--primary))',
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="patterns-section">
          <div className="patterns-grid">
            <div className="pattern-card">
              <h3>Common Triggers</h3>
              <div className="triggers-grid">
                {insights.topTriggers.map((trigger, index) => (
                  <span key={index} className="trigger-tag">{trigger}</span>
                ))}
              </div>
            </div>

            <div className="pattern-card">
              <h3>Helpful Activities</h3>
              <div className="activities-grid">
                {insights.helpfulActivities.map((activity, index) => (
                  <span key={index} className="activity-tag">
                    {activity === 'Exercise' && <Activity size={16} />}
                    {activity === 'Meditation' && <Brain size={16} />}
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            <div className="pattern-card">
              <h3>Weekly Overview</h3>
              <div className="chart-container">
                <Radar data={radarChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      min: 0,
                      max: 5,
                      ticks: {
                        stepSize: 1,
                        color: 'hsl(var(--primary)/0.7)'
                      },
                      grid: {
                        color: 'hsl(var(--primary)/0.1)'
                      },
                      angleLines: {
                        color: 'hsl(var(--primary)/0.1)'
                      },
                      pointLabels: {
                        color: 'hsl(var(--primary))'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        color: 'hsl(var(--primary))',
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="insights-section">
          <div className="insights-grid">
            <div className="insight-card">
              <h3>Recommendations</h3>
              <div className="recommendations-list">
                <div className="recommendation-item">
                  <div className="recommendation-icon">
                    <Coffee size={24} />
                  </div>
                  <div className="recommendation-content">
                    <h4>Morning Routine</h4>
                    <p>Start your day with meditation and light exercise</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="recommendation-icon">
                    <Book size={24} />
                  </div>
                  <div className="recommendation-content">
                    <h4>Evening Wind-down</h4>
                    <p>Read a book instead of screen time before bed</p>
                  </div>
                </div>
                <div className="recommendation-item">
                  <div className="recommendation-icon">
                    <Users size={24} />
                  </div>
                  <div className="recommendation-content">
                    <h4>Social Connection</h4>
                    <p>Schedule regular catch-ups with friends</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="insight-card">
              <h3>Activity Correlations</h3>
              <div className="correlations-list">
                <div className="correlation-item positive">
                  <div className="correlation-header">
                    <span className="correlation-label">Exercise</span>
                    <span className="correlation-value">+75%</span>
                  </div>
                  <div className="correlation-bar">
                    <div className="correlation-fill" style={{ width: '75%' }} />
                  </div>
                </div>
                <div className="correlation-item positive">
                  <div className="correlation-header">
                    <span className="correlation-label">Meditation</span>
                    <span className="correlation-value">+60%</span>
                  </div>
                  <div className="correlation-bar">
                    <div className="correlation-fill" style={{ width: '60%' }} />
                  </div>
                </div>
                <div className="correlation-item negative">
                  <div className="correlation-header">
                    <span className="correlation-label">Late Night Work</span>
                    <span className="correlation-value">-45%</span>
                  </div>
                  <div className="correlation-bar">
                    <div className="correlation-fill" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalWellness; 
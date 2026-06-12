import { useState, useEffect } from 'react';
import { Calendar, RefreshCw, Info } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import PlatformLayout from '../components/PlatformLayout';
import ChartWrapper from '../components/ChartWrapper';
import KPICard from '../components/KPICard';

import { generateWeeklyTrends, generateAthleteProgression } from '../utils/generateMockData';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'season'>('week');
  const [chartData, setChartData] = useState(() => generateWeeklyTrends());
  const [progressionData, setProgressionData] = useState(() => generateAthleteProgression(8));

  useEffect(() => {
    if (period === 'week') {
      setChartData(generateWeeklyTrends());
    } else {
      // For month and season, we use a wider dataset
      setChartData(generateWeeklyTrends().map((day, idx) => ({
        ...day,
        speed: day.speed > 0 ? parseFloat((day.speed * (1 + idx * 0.01)).toFixed(1)) : 0,
        load: day.load > 0 ? Math.round(day.load * (1 + idx * 0.02)) : 0,
      })));
    }
    setProgressionData(generateAthleteProgression(period === 'season' ? 12 : 8));
  }, [period]);

  // Percentile ranking data for squad comparison
  const percentileData = [
    { name: 'Max Speed', percentile: 92, average: 75 },
    { name: 'Acceleration', percentile: 86, average: 72 },
    { name: 'Agility Index', percentile: 88, average: 74 },
    { name: 'Aerobic Capacity', percentile: 78, average: 76 },
    { name: 'Neuromuscular Power', percentile: 84, average: 70 },
  ];

  return (
    <PlatformLayout
      title="Performance Analytics"
      subtitle="Deep-dive sports science analytics and telemetry time-series"
    >
      {/* Analytics Controls */}
      <div className="bg-axiom-card border border-axiom-border p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-axiom-muted" />
          <span className="text-[0.6rem] uppercase tracking-wider text-axiom-muted font-condensed font-600 mr-2">
            Analysis Period:
          </span>
          {(['week', 'month', 'season'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-[0.6rem] tracking-wider uppercase font-condensed font-700 transition-colors border ${
                period === p
                  ? 'bg-lime text-axiom-black border-lime'
                  : 'text-axiom-muted border-axiom-border hover:text-axiom-white hover:border-axiom-muted'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[0.6rem] tracking-wider uppercase text-axiom-muted font-condensed font-600">
            Source: GPS + Bio-Telemetry
          </span>
          <button className="p-1.5 border border-axiom-border text-axiom-muted hover:text-lime hover:border-lime transition-all">
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Max Sprint Speed" value="34.2" unit="km/h" trend="+1.2%" status="optimal" />
        <KPICard label="Sprint Distance Avg" value="284" unit="m" trend="+5.4%" status="good" />
        <KPICard label="Acceleration Index" value="4.8" unit="m/s²" trend="+2.1%" status="optimal" />
        <KPICard label="Acute-Chronic Ratio" value="1.14" trend="-0.04" status="low" />
      </div>

      {/* Grid of Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Speed / Acceleration Curves */}
        <ChartWrapper title="Sprint Velocity & Acceleration Profile" badgeText="GPS Analytics">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#666" fontSize={10} />
              <YAxis yAxisId="left" stroke="#BFFF00" fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} />
              <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'Barlow Condensed' }} />
              <Line yAxisId="left" name="Max Speed (km/h)" type="monotone" dataKey="speed" stroke="#BFFF00" strokeWidth={2} activeDot={{ r: 4 }} />
              <Line yAxisId="right" name="Accel Index (m/s²)" type="monotone" dataKey="acceleration" stroke="#666" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Training Load Progression */}
        <ChartWrapper title="Periodized Workload Distribution" badgeText="Load Adaptation">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAnaLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#BFFF00" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
              <Area type="monotone" name="Weekly Load (AU)" dataKey="load" stroke="#BFFF00" strokeWidth={2} fillOpacity={1} fill="url(#colorAnaLoad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Squad Percentile Comparison */}
        <ChartWrapper title="Squad Percentile Rankings" badgeText="Squad vs Elite Benchmark">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={percentileData} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis type="number" stroke="#666" fontSize={10} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" stroke="#666" fontSize={9} />
              <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'Barlow Condensed' }} />
              <Bar name="Athlete Percentile" dataKey="percentile" fill="#BFFF00" barSize={12} />
              <Bar name="Squad Avg" dataKey="average" fill="#444" barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Long-term Performance Progression */}
        <ChartWrapper title="Macrocycle Readiness & Performance Progression" badgeText="Season Adaptation">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} domain={[50, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'Barlow Condensed' }} />
              <Line name="Performance Score" type="monotone" dataKey="performanceScore" stroke="#BFFF00" strokeWidth={2} />
              <Line name="Readiness Score" type="monotone" dataKey="readinessScore" stroke="#666" strokeWidth={1.5} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Informative Note */}
      <div className="bg-axiom-card border border-axiom-border p-4 flex gap-3 items-center">
        <Info size={16} className="text-lime flex-shrink-0" />
        <p className="text-xs text-axiom-muted font-body leading-relaxed">
          All data calculations are dynamically evaluated in real-time. Performance Index integrates GPS sprint tracking, heart rate variability metrics, and load values using standard sports science formulas.
        </p>
      </div>
    </PlatformLayout>
  );
}

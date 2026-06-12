import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, FileText,
  Download, Plus, Calendar, ShieldAlert
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

import PlatformLayout from '../components/PlatformLayout';
import KPICard from '../components/KPICard';
import ProgressBar from '../components/ProgressBar';
import ChartWrapper from '../components/ChartWrapper';
import InsightBadge from '../components/InsightBadge';

import { useAthleteStore } from '../stores/useAthleteStore';
import { useDashboardStore } from '../stores/useDashboardStore';
import { generateWeeklyTrends, generateRecoveryTrends, generateAthleteProgression } from '../utils/generateMockData';

// Raw data imports
import biomechanicsData from '../data/biomechanics.json';
import recoveryData from '../data/recovery.json';
import injuryData from '../data/injury.json';
import reportsData from '../data/reports.json';

export default function AthleteProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { getAthlete } = useAthleteStore();
  const { insights } = useDashboardStore();

  const athleteId = id ? parseInt(id) : 1;
  const athlete = getAthlete(athleteId);

  const [activeTab, setActiveTab] = useState('Overview');
  const [weeklyTrends, setWeeklyTrends] = useState(() => generateWeeklyTrends());
  const [recoveryTrends, setRecoveryTrends] = useState(() => generateRecoveryTrends());
  const [progression, setProgression] = useState(() => generateAthleteProgression(6));

  useEffect(() => {
    // Re-generate mock data trends when athlete changes to feel distinct
    setWeeklyTrends(generateWeeklyTrends());
    setRecoveryTrends(generateRecoveryTrends());
    setProgression(generateAthleteProgression(6));
  }, [athleteId]);

  if (!athlete) {
    return (
      <PlatformLayout title="Athlete Profile">
        <div className="py-20 text-center text-axiom-muted">
          <ShieldAlert size={40} className="mx-auto mb-4 text-red-500" />
          <h2 className="font-condensed font-900 text-xl uppercase text-axiom-white mb-2">Athlete Not Found</h2>
          <button onClick={() => navigate('/athletes')} className="btn-outline px-4 py-2 text-xs">
            Back to Roster
          </button>
        </div>
      </PlatformLayout>
    );
  }

  // Smart Data Scaling Logic based on selected athlete's core KPIs:
  // We scale metrics so they align with the current athlete's profile (from athletes.json)
  const readinessFactor = athlete.readiness / 82;
  const performanceFactor = athlete.performanceScore / 87;
  const riskFactor = athlete.riskScore / 12;
  const recoveryFactor = athlete.recoveryScore / 78;

  // Overview / Biomechanics tab
  const scaledRadarProfile = biomechanicsData.radarProfile.map(item => ({
    metric: item.metric,
    value: Math.min(100, Math.round(item.value * performanceFactor)),
    benchmark: item.benchmark,
  }));

  const scaledBiomechScores = {
    runningMechanics: Math.min(100, Math.round(biomechanicsData.scores.runningMechanics.value * performanceFactor)),
    movementSymmetry: Math.min(100, Math.round(biomechanicsData.scores.movementSymmetry.value * performanceFactor)),
    jumpTechnique: Math.min(100, Math.round(biomechanicsData.scores.jumpTechnique.value * performanceFactor)),
    mobility: Math.min(100, Math.round(biomechanicsData.scores.mobility.value * performanceFactor)),
    movementQuality: Math.min(100, Math.round(biomechanicsData.scores.movementQuality.value * performanceFactor)),
  };

  const scaledBodyZones = biomechanicsData.bodyZones.map(zone => {
    const score = Math.max(10, Math.min(100, Math.round(zone.score / riskFactor)));
    let risk = 'low';
    if (score < 70) risk = 'high';
    else if (score < 85) risk = 'moderate';
    return { ...zone, score, risk };
  });

  // Recovery tab
  const scaledRecoveryCurrent = {
    sleepHours: parseFloat(Math.min(12, Math.max(4, recoveryData.current.sleepHours * (readinessFactor * 0.3 + 0.7))).toFixed(1)),
    sleepQuality: Math.min(100, Math.round(recoveryData.current.sleepQuality * recoveryFactor)),
    hrv: Math.min(120, Math.round(recoveryData.current.hrv * recoveryFactor)),
    hydration: Math.min(100, Math.round(recoveryData.current.hydration * (readinessFactor * 0.2 + 0.8))),
    fatigue: Math.min(100, Math.round(recoveryData.current.fatigue * riskFactor)),
    restingHR: Math.round(recoveryData.current.restingHR / (recoveryFactor * 0.1 + 0.9)),
    muscleSoreness: parseFloat(Math.min(10, Math.max(1, recoveryData.current.muscleSoreness * riskFactor)).toFixed(1)),
  };

  // Injury tab
  const scaledInjuryZones = injuryData.zones.map(z => ({
    ...z,
    score: Math.min(100, Math.round(z.score * riskFactor)),
    level: z.score * riskFactor >= 40 ? 'high' : z.score * riskFactor >= 15 ? 'moderate' : 'low',
    color: z.score * riskFactor >= 40 ? '#ef4444' : z.score * riskFactor >= 15 ? '#f59e0b' : '#22c55e',
  }));

  // Athlete specific insights (we filter global insights containing athlete's first or last name, plus show some general ones)
  const athleteInsights = insights.filter(ins => 
    ins.text.toLowerCase().includes(athlete.lastName.toLowerCase()) || 
    ins.text.toLowerCase().includes(athlete.firstName.toLowerCase()) ||
    (athlete.id === 5 && ins.category === 'Injury Risk') ||
    (athlete.status === 'resting' && ins.category === 'Recovery') ||
    (athlete.readiness > 90 && ins.category === 'Performance' && Math.random() > 0.5)
  ).slice(0, 3);

  // Fallback insights if none are found for this specific athlete
  const displayInsights = athleteInsights.length > 0 
    ? athleteInsights 
    : insights.filter(ins => ins.category === 'Performance' || ins.category === 'Recovery').slice(0, 2);

  const tabs = ['Overview', 'Performance', 'Biomechanics', 'Recovery', 'Injury Risk', 'Reports'];

  return (
    <PlatformLayout title={`${athlete.name} — Profile`}>
      {/* Back to roster header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/athletes')}
          className="flex items-center gap-1.5 text-[0.65rem] font-condensed font-700 tracking-widest text-axiom-muted hover:text-lime uppercase transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Roster
        </button>
        <span className="text-[0.65rem] font-condensed font-700 tracking-wider text-axiom-muted uppercase">
          Profile Sync: Live
        </span>
      </div>

      {/* Main Grid: Info Sidebar (4 cols) & Tab Content (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Athlete Details Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-axiom-card border border-axiom-border p-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-5">
              <img
                src={athlete.avatar}
                alt={athlete.name}
                className="w-32 h-32 border border-axiom-border object-cover"
              />
              <span className={`absolute bottom-2 right-2 w-4.5 h-4.5 rounded-full border-2 border-axiom-card flex items-center justify-center text-[0.45rem] font-condensed font-900 ${
                athlete.status === 'active' ? 'bg-lime text-axiom-black' :
                athlete.status === 'resting' ? 'bg-amber-400 text-axiom-black' : 'bg-red-500 text-axiom-white'
              }`}>
                {athlete.status.substring(0,1).toUpperCase()}
              </span>
            </div>

            {/* Basic Info */}
            <h2 className="font-condensed font-900 text-xl tracking-wider text-axiom-white">
              {athlete.name}
            </h2>
            <p className="text-[0.7rem] tracking-widest text-axiom-muted uppercase mb-4">
              No. {athlete.jerseyNumber} · {athlete.position} · {athlete.club}
            </p>

            <div className="w-full border-t border-axiom-border pt-4 mt-2 grid grid-cols-3 gap-2">
              <div className="text-center">
                <span className="text-[0.6rem] tracking-wider uppercase text-axiom-muted block">Age</span>
                <span className="font-condensed font-700 text-sm text-axiom-white">{athlete.age} yr</span>
              </div>
              <div className="text-center border-x border-axiom-border">
                <span className="text-[0.6rem] tracking-wider uppercase text-axiom-muted block">Height</span>
                <span className="font-condensed font-700 text-sm text-axiom-white">{athlete.height} cm</span>
              </div>
              <div className="text-center">
                <span className="text-[0.6rem] tracking-wider uppercase text-axiom-muted block">Weight</span>
                <span className="font-condensed font-700 text-sm text-axiom-white">{athlete.weight} kg</span>
              </div>
            </div>

            <div className="w-full border-t border-axiom-border pt-4 mt-4 text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-axiom-muted">Sport</span>
                <span className="font-condensed font-700 text-axiom-white uppercase">{athlete.sport}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-axiom-muted">Dominant Foot</span>
                <span className="font-condensed font-700 text-axiom-white uppercase">{athlete.dominantFoot}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-axiom-muted">Nationality</span>
                <span className="font-condensed font-700 text-axiom-white uppercase">{athlete.nationality}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-axiom-muted">Joined Date</span>
                <span className="font-condensed font-700 text-axiom-white uppercase">{athlete.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Widget */}
          <div className="bg-axiom-card border border-axiom-border p-5">
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
              Physical Thresholds
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-axiom-muted">Sprint Velocity Peak</span>
                  <span className="text-lime font-condensed font-700">{athlete.sprintSpeed} km/h</span>
                </div>
                <ProgressBar value={(athlete.sprintSpeed / 36) * 100} showValue={false} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-axiom-muted">VO2 Max estimate</span>
                  <span className="text-lime font-condensed font-700">{athlete.vo2max} ml/kg</span>
                </div>
                <ProgressBar value={(athlete.vo2max / 70) * 100} showValue={false} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tabs and Content */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Tab Headers */}
          <div className="bg-axiom-card border border-axiom-border flex overflow-x-auto scrollbar-none mb-6">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn whitespace-nowrap px-5 py-4 ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Panel contents */}
          <div className="flex-1">
            {/* OVERVIEW TAB */}
            {activeTab === 'Overview' && (
              <div className="space-y-6">
                {/* 4 Core KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KPICard label="Readiness" value={athlete.readiness} unit="%" status={athlete.readiness >= 85 ? 'optimal' : athlete.readiness >= 65 ? 'moderate' : 'critical'} />
                  <KPICard label="Injury Risk" value={athlete.riskScore} unit="%" status={athlete.riskScore >= 50 ? 'high' : athlete.riskScore >= 20 ? 'moderate' : 'low'} />
                  <KPICard label="Weekly Load" value={athlete.trainingLoad} unit="AU" status={athlete.trainingLoad > 600 ? 'elevated' : 'moderate'} />
                  <KPICard label="Perf Score" value={athlete.performanceScore > 0 ? athlete.performanceScore : '-'} status={athlete.performanceScore >= 85 ? 'optimal' : athlete.performanceScore >= 65 ? 'moderate' : 'critical'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Radar Assessment Profile */}
                  <ChartWrapper title="Assessment Profile">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" data={scaledRadarProfile}>
                        <PolarGrid stroke="#222" />
                        <PolarAngleAxis dataKey="metric" stroke="#666" fontSize={9} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#333" fontSize={8} />
                        <Radar name={athlete.name} dataKey="value" stroke="#BFFF00" fill="#BFFF00" fillOpacity={0.2} />
                        <Radar name="Elite Avg" dataKey="benchmark" stroke="#666" fill="#666" fillOpacity={0.05} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartWrapper>

                  {/* AI Insights & Bio Recommendations */}
                  <div className="bg-axiom-card border border-axiom-border p-5 flex flex-col">
                    <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
                      Active AI Observations
                    </h3>
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px]">
                      {displayInsights.map(ins => (
                        <InsightBadge key={ins.id} insight={ins} compact={true} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PERFORMANCE TAB */}
            {activeTab === 'Performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ChartWrapper title="Velocity Trend (Peak Speed)">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="speed" stroke="#BFFF00" strokeWidth={2} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartWrapper>

                  <ChartWrapper title="Training Load Curve">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#BFFF00" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                        <Area type="monotone" dataKey="load" stroke="#BFFF00" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartWrapper>

                  <ChartWrapper title="Neuromuscular Power Trend (Watts)">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="power" stroke="#BFFF00" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartWrapper>

                  <ChartWrapper title="Long-term Perf Score Progression">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progression} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                        <XAxis dataKey="week" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} domain={[40, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                        <Line type="monotone" dataKey="performanceScore" stroke="#BFFF00" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartWrapper>
                </div>
              </div>
            )}

            {/* BIOMECHANICS TAB */}
            {activeTab === 'Biomechanics' && (
              <div className="space-y-6">
                {/* 5 Biomechanical Gauges */}
                <div className="bg-axiom-card border border-axiom-border p-5">
                  <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-6">
                    Biomechanical Function Gauges
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-lime/30 flex items-center justify-center font-condensed font-900 text-lime text-base mb-2">
                        {scaledBiomechScores.runningMechanics}
                      </div>
                      <span className="text-[0.6rem] text-axiom-muted font-condensed font-700 uppercase text-center leading-normal">Running Mechanics</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-lime/30 flex items-center justify-center font-condensed font-900 text-lime text-base mb-2">
                        {scaledBiomechScores.movementSymmetry}
                      </div>
                      <span className="text-[0.6rem] text-axiom-muted font-condensed font-700 uppercase text-center leading-normal">Movement Symmetry</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-lime/30 flex items-center justify-center font-condensed font-900 text-lime text-base mb-2">
                        {scaledBiomechScores.jumpTechnique}
                      </div>
                      <span className="text-[0.6rem] text-axiom-muted font-condensed font-700 uppercase text-center leading-normal">Jump Technique</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-lime/30 flex items-center justify-center font-condensed font-900 text-lime text-base mb-2">
                        {scaledBiomechScores.mobility}
                      </div>
                      <span className="text-[0.6rem] text-axiom-muted font-condensed font-700 uppercase text-center leading-normal">Joint Mobility</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-lime flex items-center justify-center font-condensed font-900 text-lime text-base mb-2 shadow-[0_0_8px_rgba(191,255,0,0.2)]">
                        {scaledBiomechScores.movementQuality}
                      </div>
                      <span className="text-[0.6rem] text-axiom-muted font-condensed font-700 uppercase text-center leading-normal">Stride Quality</span>
                    </div>
                  </div>
                </div>

                {/* Biomechanical Risk Zones & Joint Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Joint Health Table */}
                  <div className="bg-axiom-card border border-axiom-border p-5">
                    <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
                      Joint Load & Function Scores
                    </h3>
                    <div className="space-y-3">
                      {scaledBodyZones.map((zone, idx) => {
                        let barColor = 'bg-lime';
                        let textColor = 'text-lime';
                        if (zone.risk === 'high') {
                          barColor = 'bg-red-500';
                          textColor = 'text-red-400';
                        } else if (zone.risk === 'moderate') {
                          barColor = 'bg-amber-500';
                          textColor = 'text-amber-400';
                        }

                        return (
                          <div key={idx}>
                            <div className="flex justify-between items-center text-xs mb-1.5 font-condensed">
                              <span className="text-axiom-muted uppercase font-600">{zone.zone.replace('_', ' ')}</span>
                              <span className={`${textColor} font-700`}>{zone.score} / 100</span>
                            </div>
                            <div className="w-full bg-axiom-border h-1.5 overflow-hidden">
                              <div className={`h-full ${barColor}`} style={{ width: `${zone.score}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SVG Body Diagram Placeholder & Clinical notes */}
                  <div className="bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
                        Kinematic Symmetry Analysis
                      </h3>
                      <p className="text-xs text-axiom-muted leading-relaxed mb-4">
                        Clinical gait analysis reveals a slight biomechanical restriction at the <strong>Lower Back</strong> and <strong>Left Hip</strong> during high-speed decels. Right-to-left asymmetry currently stands at <strong>8.2%</strong> (target threshold is &lt; 5.0%).
                      </p>
                      <ul className="text-xs text-axiom-white space-y-2 list-disc pl-4">
                        <li>Left hip flexion reduced by 4 degrees.</li>
                        <li>Slight pelvic drop noted on left side during stride loading.</li>
                        <li>Ankle dorsiflexion within acceptable bilateral balance.</li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t border-axiom-border text-center">
                      <span className="text-[0.6rem] text-lime font-condensed font-700 tracking-wider uppercase">
                        Corrective mobility exercises updated in Settings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RECOVERY TAB */}
            {activeTab === 'Recovery' && (
              <div className="space-y-6">
                {/* Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KPICard label="Sleep Duration" value={`${scaledRecoveryCurrent.sleepHours}h`} status={scaledRecoveryCurrent.sleepHours >= 7.5 ? 'optimal' : 'moderate'} />
                  <KPICard label="Sleep Quality" value={`${scaledRecoveryCurrent.sleepQuality}%`} status={scaledRecoveryCurrent.sleepQuality >= 80 ? 'optimal' : 'moderate'} />
                  <KPICard label="Heart Rate Var (HRV)" value={`${scaledRecoveryCurrent.hrv}ms`} status={scaledRecoveryCurrent.hrv >= 60 ? 'optimal' : 'moderate'} />
                  <KPICard label="Muscle Soreness" value={`${scaledRecoveryCurrent.muscleSoreness}/10`} status={scaledRecoveryCurrent.muscleSoreness < 4 ? 'low' : 'high'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recovery 7-day trend Area Chart */}
                  <ChartWrapper title="7-Day Recovery State Curve">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={recoveryTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#BFFF00" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                        <XAxis dataKey="day" stroke="#666" fontSize={10} />
                        <YAxis stroke="#666" fontSize={10} domain={[30, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                        <Area type="monotone" dataKey="recovery" stroke="#BFFF00" strokeWidth={2} fillOpacity={1} fill="url(#colorRec)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartWrapper>

                  {/* Recommendations panel */}
                  <div className="bg-axiom-card border border-axiom-border p-5">
                    <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
                      Recovery Strategy Advisories
                    </h3>
                    <div className="space-y-3">
                      {recoveryData.recommendations.map((rec, idx) => {
                        let badgeColor = 'text-lime border-lime/20 bg-lime/5';
                        if (rec.priority === 'high') {
                          badgeColor = 'text-red-400 border-red-400/20 bg-red-400/5';
                        } else if (rec.priority === 'medium') {
                          badgeColor = 'text-amber-400 border-amber-400/20 bg-amber-400/5';
                        }

                        return (
                          <div key={idx} className="flex gap-3 items-start border-b border-axiom-border/30 pb-3 last:border-b-0 last:pb-0">
                            <span className={`text-[0.55rem] font-condensed font-700 uppercase px-1.5 py-0.5 border flex-shrink-0 mt-0.5 ${badgeColor}`}>
                              {rec.priority}
                            </span>
                            <p className="text-xs text-axiom-white leading-relaxed">{rec.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INJURY RISK TAB */}
            {activeTab === 'Injury Risk' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Injury Risk Factors */}
                  <div className="bg-axiom-card border border-axiom-border p-5">
                    <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
                      Key Risk Factors & Impact
                    </h3>
                    <div className="space-y-3">
                      {injuryData.riskFactors.map((f, idx) => {
                        let impactColor = 'text-lime border-lime/20 bg-lime/5';
                        if (f.impact === 'high') {
                          impactColor = 'text-red-400 border-red-400/20 bg-red-400/5';
                        } else if (f.impact === 'moderate') {
                          impactColor = 'text-amber-400 border-amber-400/20 bg-amber-400/5';
                        }

                        return (
                          <div key={idx} className="border-b border-axiom-border/30 pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs font-condensed font-700 tracking-wider text-axiom-white uppercase">{f.factor}</span>
                              <span className={`text-[0.55rem] font-condensed font-700 uppercase px-1.5 py-0.5 border ${impactColor}`}>
                                {f.impact} Impact
                              </span>
                            </div>
                            <p className="text-xs text-axiom-muted leading-relaxed">{f.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Body Zone risk breakdown list */}
                  <div className="bg-axiom-card border border-axiom-border p-5">
                    <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
                      Kinematic Risk Zones
                    </h3>
                    <div className="space-y-3.5">
                      {scaledInjuryZones.map((z, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs mb-1 font-condensed">
                            <span className="text-axiom-muted font-600 uppercase">{z.zone}</span>
                            <span className="text-axiom-white font-700" style={{ color: z.color }}>
                              {z.score}% Risk ({z.level})
                            </span>
                          </div>
                          <div className="w-full bg-axiom-border h-1.5 overflow-hidden">
                            <div className="h-full" style={{ width: `${z.score}%`, backgroundColor: z.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'Reports' && (
              <div className="bg-axiom-card border border-axiom-border p-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white flex items-center gap-2">
                    <FileText size={13} className="text-lime" />
                    Generated Reports Library
                  </h3>
                  <button className="flex items-center gap-1 bg-lime text-axiom-black font-condensed font-900 text-xs tracking-[2px] uppercase px-3 py-1.5 transition-colors hover:bg-axiom-white">
                    <Plus size={12} />
                    New Report
                  </button>
                </div>

                <div className="space-y-4">
                  {reportsData.reports.map(rep => {
                    const isMatchReport = rep.type === 'match_performance';
                    
                    return (
                      <div key={rep.id} className="border border-axiom-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-lime/20 transition-all">
                        <div>
                          <h4 className="font-condensed font-700 text-xs tracking-wider text-axiom-white uppercase mb-1">
                            {rep.title}
                          </h4>
                          <p className="text-[0.7rem] text-axiom-muted font-body mb-2 leading-relaxed">
                            {rep.description}
                          </p>
                          <span className="text-[0.6rem] text-axiom-muted font-condensed font-600 uppercase flex items-center gap-1">
                            <Calendar size={10} />
                            Last Sync: {rep.lastGenerated}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                          {isMatchReport ? (
                            <button
                              onClick={() => navigate('/reports/match')}
                              className="report-action-btn primary"
                            >
                              Showcase Report
                            </button>
                          ) : (
                            <button className="report-action-btn">
                              Preview
                            </button>
                          )}
                          
                          <button className="report-action-btn">
                            <Download size={11} />
                            PDF
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Download, Printer, Share2, Bookmark,
  AlertTriangle, ShieldCheck, Thermometer, Wind
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line
} from 'recharts';

import PlatformLayout from '../components/PlatformLayout';
import ChartWrapper from '../components/ChartWrapper';
import ProgressBar from '../components/ProgressBar';

import matchData from '../data/matches.json';
import { useAthleteStore } from '../stores/useAthleteStore';

export default function MatchReportPage() {
  const navigate = useNavigate();
  const { athletes } = useAthleteStore();

  // Interactive selectors state
  const [selectedMatch, setSelectedMatch] = useState('m1');
  const [selectedPlayerId, setSelectedPlayerId] = useState(1);
  
  // Find selected athlete
  const athlete = athletes.find(a => a.id === selectedPlayerId) || athletes[0];
  const { speedZones, metrics, halfComparison, workRateTimeline, positionBenchmark, radarScores, performanceScore, matchInfo, aiObservations, recoveryAdvice, coachingRecommendations, reportMetadata, availableMatches } = matchData;

  // Custom Colors for speed zone donut chart
  const zoneColors = ['#1C1C1E', '#3A3A3C', '#636366', '#8FBF00', '#BFFF00', '#D7FF00'];

  const radarData = [
    { subject: 'Running Vol', value: radarScores.runningVolume, fullMark: 100 },
    { subject: 'Sprint Output', value: radarScores.sprintOutput, fullMark: 100 },
    { subject: 'Speed Cap', value: radarScores.speedCapacity, fullMark: 100 },
    { subject: 'Work Rate', value: radarScores.workRate, fullMark: 100 },
    { subject: 'Tech Efficiency', value: radarScores.technicalEfficiency, fullMark: 100 },
  ];

  const halfData = [
    { name: 'Distance (m)', '1st Half': halfComparison.firstHalf.distance, '2nd Half': halfComparison.secondHalf.distance },
    { name: 'HSR Runs', '1st Half': halfComparison.firstHalf.highSpeedRuns * 100, '2nd Half': halfComparison.secondHalf.highSpeedRuns * 100 }, // Scaled for visual balance
    { name: 'Sprints', '1st Half': halfComparison.firstHalf.sprints * 200, '2nd Half': halfComparison.secondHalf.sprints * 200 }, // Scaled for visual balance
  ];

  return (
    <PlatformLayout
      title="Match Performance Showcase"
      subtitle="Comprehensive GPS-telemetry match analytics report"
    >
      {/* Back to Reports */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/reports')}
          className="flex items-center gap-1.5 text-[0.65rem] font-condensed font-700 tracking-widest text-axiom-muted hover:text-lime uppercase transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Report Library
        </button>
      </div>

      {/* FILTER BAR & REPORT ACTIONS */}
      <div className="bg-axiom-card border border-axiom-border p-4 mb-6 flex flex-col xl:flex-row gap-4 items-center justify-between">
        {/* Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Player Select */}
          <div className="flex items-center gap-1 bg-axiom-black border border-axiom-border px-2 py-1">
            <span className="text-[0.6rem] uppercase tracking-wider text-axiom-muted font-condensed font-600 mr-2">Player:</span>
            <select
              value={selectedPlayerId}
              onChange={e => setSelectedPlayerId(parseInt(e.target.value))}
              className="bg-transparent border-none text-xs text-axiom-white font-condensed font-700 uppercase outline-none cursor-pointer pr-4"
            >
              {athletes.map(a => (
                <option key={a.id} value={a.id} className="bg-axiom-card text-axiom-white">{a.name}</option>
              ))}
            </select>
          </div>

          {/* Match Select */}
          <div className="flex items-center gap-1 bg-axiom-black border border-axiom-border px-2 py-1">
            <span className="text-[0.6rem] uppercase tracking-wider text-axiom-muted font-condensed font-600 mr-2">Match:</span>
            <select
              value={selectedMatch}
              onChange={e => setSelectedMatch(e.target.value)}
              className="bg-transparent border-none text-xs text-axiom-white font-condensed font-700 uppercase outline-none cursor-pointer pr-4"
            >
              {availableMatches.map(m => (
                <option key={m.id} value={m.id} className="bg-axiom-card text-axiom-white">{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full xl:w-auto justify-end">
          <button onClick={() => window.print()} className="report-action-btn primary flex items-center gap-1">
            <Printer size={12} /> Print Report
          </button>
          <button onClick={() => alert('PDF report exported successfully!')} className="report-action-btn flex items-center gap-1">
            <Download size={12} /> Export PDF
          </button>
          <button onClick={() => alert('Secure share link generated!')} className="report-action-btn flex items-center gap-1">
            <Share2 size={12} /> Share
          </button>
          <button className="report-action-btn flex items-center justify-center p-2">
            <Bookmark size={12} />
          </button>
        </div>
      </div>

      {/* REPORT CONTENT VIEWPORT */}
      <div className="bg-axiom-card border border-axiom-border p-6 md:p-8 space-y-8 print:bg-white print:text-black">
        {/* 1. Athlete Overview Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-axiom-border pb-6 gap-4">
          <div className="flex items-center gap-4">
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className="w-16 h-16 border border-axiom-border object-cover flex-shrink-0"
            />
            <div>
              <h1 className="font-condensed font-900 text-2xl tracking-wider text-axiom-white uppercase print:text-black">{athlete.name}</h1>
              <p className="text-xs text-axiom-muted uppercase tracking-widest font-condensed font-700">
                {positionBenchmark.position} · No. {athlete.jerseyNumber} · {athlete.nationality}
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col gap-1">
            <span className="text-xs text-lime font-condensed font-900 uppercase tracking-widest">{matchInfo.match}</span>
            <span className="text-[0.65rem] text-axiom-muted font-condensed font-600 uppercase">
              {matchInfo.competition} · {matchInfo.date} · {matchInfo.venue}
            </span>
          </div>
        </div>

        {/* 2. Performance Score & 3. Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Performance Score */}
          <div className="lg:col-span-4 bg-axiom-black border border-axiom-border p-5 flex flex-col items-center justify-center text-center">
            <span className="text-[0.6rem] tracking-[2px] uppercase text-axiom-muted font-condensed font-700 mb-2">
              Performance Index
            </span>
            <div className="w-24 h-24 rounded-full border-4 border-lime/20 flex flex-col items-center justify-center mb-3">
              <span className="font-condensed font-900 text-3xl text-lime leading-none">{performanceScore.overall}</span>
              <span className="text-[0.6rem] tracking-widest text-axiom-muted uppercase font-700 mt-1">Grade {performanceScore.grade}</span>
            </div>
            <span className="text-[0.75rem] font-condensed font-900 text-axiom-white tracking-widest uppercase">
              {performanceScore.status}
            </span>
          </div>

          {/* Performance Summary Text */}
          <div className="lg:col-span-8 bg-axiom-black/45 border border-axiom-border p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-3">
                Telemetry Summary & Observations
              </h3>
              <p className="text-xs text-axiom-muted leading-relaxed font-body">
                Winger total running volume and high-speed sprint performance exceeded expectations, sitting in the <strong>85th percentile</strong>. Accelerations were highly explosive, hitting peak thresholds. However, a significant <strong>10.3% drop-off</strong> in training load and sprints occurred in the second half, indicating early dynamic fatigue. Active recovery advised.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-axiom-border mt-4">
              <div className="text-xs">
                <span className="text-lime font-bold block">Key Strength:</span>
                <span className="text-axiom-white">Peak sprint speed (34.2 km/h) clearing elite standards.</span>
              </div>
              <div className="text-xs">
                <span className="text-amber-400 font-bold block">Key Vulnerability:</span>
                <span className="text-axiom-white">Second-half volume drop-off at ~65 minutes.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Key Metrics Grid */}
        <div>
          <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
            GPS Match Telemetry Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-axiom-black border border-axiom-border p-4 flex flex-col justify-between">
              <span className="text-[0.55rem] text-axiom-muted uppercase tracking-wider font-condensed font-700">Total Distance</span>
              <span className="font-condensed font-900 text-xl text-lime mt-1.5">{(metrics.totalDistance.value / 1000).toFixed(2)} km</span>
              <span className="text-[0.5rem] text-axiom-muted uppercase mt-1">Bench: {(metrics.totalDistance.benchmark / 1000).toFixed(1)}k</span>
            </div>
            <div className="bg-axiom-black border border-axiom-border p-4 flex flex-col justify-between">
              <span className="text-[0.55rem] text-axiom-muted uppercase tracking-wider font-condensed font-700">HSR Distance</span>
              <span className="font-condensed font-900 text-xl text-lime mt-1.5">{metrics.highSpeedRunDistance.value} m</span>
              <span className="text-[0.5rem] text-axiom-muted uppercase mt-1">Bench: {metrics.highSpeedRunDistance.benchmark}m</span>
            </div>
            <div className="bg-axiom-black border border-axiom-border p-4 flex flex-col justify-between">
              <span className="text-[0.55rem] text-axiom-muted uppercase tracking-wider font-condensed font-700">Sprint Distance</span>
              <span className="font-condensed font-900 text-xl text-lime mt-1.5">{metrics.sprintDistance.value} m</span>
              <span className="text-[0.5rem] text-axiom-muted uppercase mt-1">Bench: {metrics.sprintDistance.benchmark}m</span>
            </div>
            <div className="bg-axiom-black border border-axiom-border p-4 flex flex-col justify-between">
              <span className="text-[0.55rem] text-axiom-muted uppercase tracking-wider font-condensed font-700">Max Velocity</span>
              <span className="font-condensed font-900 text-xl text-lime mt-1.5">{metrics.maxSpeed.value} km/h</span>
              <span className="text-[0.5rem] text-axiom-muted uppercase mt-1">Bench: {metrics.maxSpeed.benchmark}</span>
            </div>
            <div className="bg-axiom-black border border-axiom-border p-4 flex flex-col justify-between">
              <span className="text-[0.55rem] text-axiom-muted uppercase tracking-wider font-condensed font-700">Player Load</span>
              <span className="font-condensed font-900 text-xl text-lime mt-1.5">{metrics.totalLoad.value} AU</span>
              <span className="text-[0.5rem] text-axiom-muted uppercase mt-1">Bench: {metrics.totalLoad.benchmark} AU</span>
            </div>
            <div className="bg-axiom-black border border-axiom-border p-4 flex flex-col justify-between">
              <span className="text-[0.55rem] text-axiom-muted uppercase tracking-wider font-condensed font-700">Energy Expenditure</span>
              <span className="font-condensed font-900 text-xl text-lime mt-1.5">{metrics.energyExpended.value} kcal</span>
              <span className="text-[0.5rem] text-axiom-muted uppercase mt-1">Bench: {metrics.energyExpended.benchmark}</span>
            </div>
          </div>
        </div>

        {/* 5. Speed Zones & 6. 1st vs 2nd Half Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Speed Zones Donut Chart */}
          <ChartWrapper title="Velocity Zone Distribution (% duration)" badgeText="Gait Velocity Analysis">
            <div className="flex flex-col md:flex-row items-center gap-6 h-full">
              <div className="w-1/2 min-h-[160px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={speedZones}
                      cx="50%"
                      cy="50%"
                      innerRadius="50%"
                      outerRadius="75%"
                      paddingAngle={3}
                      dataKey="percentage"
                    >
                      {speedZones.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={zoneColors[index % zoneColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-1.5">
                {speedZones.map((z, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[0.68rem]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zoneColors[idx] }} />
                      <span className="text-axiom-muted font-condensed font-700 uppercase">{z.zone}</span>
                    </div>
                    <span className="font-condensed font-900 text-axiom-white">{z.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartWrapper>

          {/* 1st vs 2nd Half Comparison */}
          <ChartWrapper title="Half-by-Half Performance Degradation" badgeText="Load & Sprint Degradation">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={halfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontFamily: 'Barlow Condensed' }} />
                <Bar name="1st Half" dataKey="1st Half" fill="#BFFF00" barSize={12} />
                <Bar name="2nd Half" dataKey="2nd Half" fill="#555" barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* 7. AI Insight Engine */}
        <div className="bg-axiom-black border border-axiom-border p-5">
          <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
            AI Automated Telemetry Observations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiObservations.map((obs, idx) => {
              let classes = 'border-lime/20 text-lime bg-lime/5';
              if (obs.severity === 'warning') classes = 'border-amber-400/20 text-amber-400 bg-amber-400/5';
              else if (obs.severity === 'alert') classes = 'border-red-500/20 text-red-400 bg-red-500/5';

              return (
                <div key={idx} className={`p-3 border text-xs flex gap-2 items-start ${classes}`}>
                  <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                  <span className="font-body leading-relaxed text-axiom-white">{obs.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Position Benchmark & 9. Score Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Position Benchmarks */}
          <div className="bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between">
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-6">
              Positional Target Benchmark (Right Winger)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-condensed">
                  <span className="text-axiom-muted font-600">Total Distance Output</span>
                  <span className="text-lime font-700">{metrics.totalDistance.value}m / {positionBenchmark.eliteAverage.totalDistance}m</span>
                </div>
                <ProgressBar value={(metrics.totalDistance.value / positionBenchmark.eliteAverage.totalDistance) * 100} showValue={false} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-condensed">
                  <span className="text-axiom-muted font-600">High Speed Running Distance</span>
                  <span className="text-lime font-700">{metrics.highSpeedRunDistance.value}m / {positionBenchmark.eliteAverage.highSpeedRuns}m</span>
                </div>
                <ProgressBar value={(metrics.highSpeedRunDistance.value / positionBenchmark.eliteAverage.highSpeedRuns) * 100} showValue={false} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-condensed">
                  <span className="text-axiom-muted font-600">Sprint Distance volume</span>
                  <span className="text-lime font-700">{metrics.sprintDistance.value}m / {positionBenchmark.eliteAverage.sprints}m</span>
                </div>
                <ProgressBar value={(metrics.sprintDistance.value / positionBenchmark.eliteAverage.sprints) * 100} showValue={false} />
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <ChartWrapper title="Tactical Physical Capacity Profile" badgeText="Position Radar">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" data={radarData}>
                <PolarGrid stroke="#222" />
                <PolarAngleAxis dataKey="subject" stroke="#666" fontSize={8} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#333" fontSize={8} />
                <Radar name={athlete.name} dataKey="value" stroke="#BFFF00" fill="#BFFF00" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* 10. Heat Map Simulator & 11. Work Rate Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pitch Heat Map (5/12 cols) */}
          <div className="lg:col-span-5 bg-axiom-black border border-axiom-border p-5 flex flex-col justify-between">
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
              Positional Activity Heatmap
            </h3>
            {/* SVG Pitch Heatmap Simulator */}
            <div className="w-full aspect-[2/3] max-w-[280px] mx-auto border border-axiom-border bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
              {/* Pitch markings */}
              <div className="absolute inset-4 border border-dashed border-[#222]" />
              <div className="absolute top-1/2 left-4 right-4 h-px border-t border-[#222]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-[#222] rounded-full" />
              {/* Penalty boxes */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-14 border-b border-x border-[#222]" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-14 border-t border-x border-[#222]" />
              
              {/* Heat overlay circles */}
              <div className="absolute top-[20%] right-[15%] w-24 h-24 rounded-full bg-lime/10 border border-lime/30 filter blur-md" />
              <div className="absolute top-[40%] right-[10%] w-20 h-20 rounded-full bg-lime/20 border border-lime/50 filter blur-sm" />
              <div className="absolute top-[60%] right-[12%] w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 filter blur-md" />
              <div className="absolute top-[25%] right-[20%] w-8 h-8 rounded-full bg-red-500/25 border border-red-500/40 filter blur-[2px]" />

              <span className="absolute bottom-2 left-2 text-[0.55rem] text-axiom-muted font-condensed font-700 uppercase">
                Attacking Direction →
              </span>
            </div>
            <div className="text-center mt-3">
              <span className="text-[0.6rem] text-axiom-muted uppercase tracking-wider font-condensed font-600">
                High intensity sprint zones flagged in red
              </span>
            </div>
          </div>

          {/* Timeline Chart (7/12 cols) */}
          <div className="lg:col-span-7">
            <ChartWrapper title="Load Work-rate timeline (minute-by-minute)" badgeText="Neuromuscular fatigue monitoring">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workRateTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                  <XAxis dataKey="minute" stroke="#666" fontSize={9} label={{ value: 'Match Minute', position: 'insideBottomRight', offset: -10, fill: '#666' }} />
                  <YAxis stroke="#666" fontSize={10} label={{ value: 'Load/Min (AU)', angle: -90, position: 'insideLeft', offset: 10, fill: '#666' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                  <Line type="monotone" name="Running Work-rate" dataKey="load" stroke="#BFFF00" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* 12. Fatigue & Load Analysis & 13. Recovery Advice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recovery Advice Cards (7/12 cols) */}
          <div className="lg:col-span-7 bg-axiom-card border border-axiom-border p-5">
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-lime" />
              Prescribed Post-Match Recovery Advice
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recoveryAdvice.map((adv, idx) => (
                <div key={idx} className="bg-axiom-black border border-axiom-border p-3 flex flex-col justify-between">
                  <h4 className="font-condensed font-700 text-xs tracking-wider text-lime uppercase mb-1">
                    {adv.title}
                  </h4>
                  <p className="text-[0.65rem] text-axiom-muted leading-relaxed font-body">
                    {adv.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fatigue load panel (5/12 cols) */}
          <div className="lg:col-span-5 bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-3">
                Dynamic Load & Fatigue Assessment
              </h3>
              <p className="text-xs text-axiom-muted leading-relaxed font-body">
                The metabolic curve indicates stable glycogen depletion rates in the first 60 minutes. Dynamic deceleration imbalances arose during transition sprints at <strong>70'</strong> and <strong>83'</strong>. An acute workload recovery threshold check is required within 24 hours.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-axiom-border text-[0.65rem] text-axiom-muted font-condensed uppercase flex justify-between">
              <span>Dynamic Asymmetry: 8.2%</span>
              <span>Metabolic Score: 92%</span>
            </div>
          </div>
        </div>

        {/* 14. Coaching Recommendations */}
        <div className="bg-axiom-black border border-axiom-border p-5">
          <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
            Actuations & Coaching Recommendations
          </h3>
          <div className="space-y-2.5">
            {coachingRecommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs font-body text-axiom-white">
                <span className="text-lime font-bold mt-0.5">{idx + 1}.</span>
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 15. Match Context & 16. Metadata & 17. QR code */}
        <div className="border-t border-axiom-border pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Match Context (4/12 cols) */}
          <div className="md:col-span-4 text-xs space-y-1.5 font-condensed">
            <span className="text-[0.6rem] text-axiom-muted uppercase tracking-widest font-700 block mb-1">Match Context</span>
            <div className="flex justify-between uppercase">
              <span className="text-axiom-muted">Venue</span>
              <span className="text-axiom-white font-600">{matchInfo.venue}</span>
            </div>
            <div className="flex justify-between uppercase">
              <span className="text-axiom-muted">Weather</span>
              <span className="text-axiom-white font-600 flex items-center gap-1"><Thermometer size={10} className="text-lime" /> {matchInfo.weather}</span>
            </div>
            <div className="flex justify-between uppercase">
              <span className="text-axiom-muted">Pitch Condition</span>
              <span className="text-axiom-white font-600 flex items-center gap-1"><Wind size={10} className="text-lime" /> {matchInfo.pitchCondition}</span>
            </div>
          </div>

          {/* Metadata (5/12 cols) */}
          <div className="md:col-span-5 text-[0.62rem] text-axiom-muted space-y-1 font-condensed uppercase border-t md:border-t-0 md:border-x border-axiom-border md:px-6 py-4 md:py-0">
            <span className="text-[0.6rem] text-axiom-muted uppercase tracking-widest font-700 block mb-1">Report Registry Details</span>
            <div>Report ID: {reportMetadata.reportId}</div>
            <div>Analyst Registry: {reportMetadata.analyst}</div>
            <div>Source Hardware: {reportMetadata.dataSource}</div>
            <div>Registry Timestamp: {reportMetadata.generatedDate} · Version {reportMetadata.version}</div>
          </div>

          {/* QR code validation placeholder (3/12 cols) */}
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
            {/* SVG QR code placeholder */}
            <div className="w-16 h-16 border border-axiom-border bg-axiom-black p-1 mb-2">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-axiom-muted opacity-80">
                <rect x="0" y="0" width="25" height="25" />
                <rect x="75" y="0" width="25" height="25" />
                <rect x="0" y="75" width="25" height="25" />
                <rect x="35" y="35" width="30" height="30" />
                <rect x="75" y="75" width="10" height="10" />
                <rect x="85" y="85" width="15" height="15" />
                <rect x="15" y="35" width="10" height="10" />
                <rect x="35" y="15" width="10" height="10" />
              </svg>
            </div>
            <span className="text-[0.5rem] tracking-[1.5px] uppercase text-axiom-muted font-condensed font-700">
              AXIOM Verified Report
            </span>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}

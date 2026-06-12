import { useState } from 'react';
import { Info } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import PlatformLayout from '../components/PlatformLayout';
import ChartWrapper from '../components/ChartWrapper';
import KPICard from '../components/KPICard';

import biomechanicsData from '../data/biomechanics.json';

export default function BiomechanicsPage() {
  const [selectedZone, setSelectedZone] = useState<string>('lower_back');

  const activeZoneData = biomechanicsData.bodyZones.find(z => z.zone === selectedZone) || biomechanicsData.bodyZones[4];

  // Map zone identifiers to friendly labels
  const zoneLabels: Record<string, string> = {
    left_knee: 'Left Knee Joint',
    right_knee: 'Right Knee Joint',
    left_hip: 'Left Hip / Pelvic Loader',
    right_hip: 'Right Hip Joint',
    lower_back: 'Lower Lumbar Spine',
    left_ankle: 'Left Ankle Stabiliser',
    right_ankle: 'Right Ankle Stabiliser',
  };

  // Map zone descriptions
  const zoneDescriptions: Record<string, string> = {
    left_knee: 'Gait assessment shows normal patellar tracking and load absorption. Eccentric quad loading within nominal limits.',
    right_knee: 'High stability score. Nominal knee flexion angle during peak acceleration blocks.',
    left_hip: 'Slight dynamic restriction (pelvic drop) noted during lateral agility drills. Joint range of motion reduced by 4°.',
    right_hip: 'Normal gait mechanics. Strong stabilization during single-leg landing.',
    lower_back: 'L5-S1 lumbar spinal rotation flags slight stiffness. Associated with minor hamstring tightness during decels.',
    left_ankle: 'Proprioceptive score normal, though dynamic instability slightly flagged under fatigue.',
    right_ankle: 'Elite ankle stiffness values. Rapid ground contact transition speed preserved.',
  };

  return (
    <PlatformLayout
      title="Biomechanics Lab"
      subtitle="Kinematic analysis, joint loading, and dynamic symmetry mapping"
    >
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Running Mechanics" value="91" unit="Index" trend="+3" status="optimal" />
        <KPICard label="Movement Symmetry" value="88" unit="%" trend="+2" status="good" />
        <KPICard label="Jump Mechanics" value="84" unit="Index" trend="+1" status="good" />
        <KPICard label="Joint Mobility avg" value="79" unit="Index" trend="-1" status="moderate" />
      </div>

      {/* 5 Biomechanical Gauges Row */}
      <div className="bg-axiom-card border border-axiom-border p-6 mb-6">
        <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-6">
          Biomechanical Function Indices
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          {Object.entries(biomechanicsData.scores).map(([key, score]) => (
            <div key={key} className="flex flex-col items-center">
              <div className="w-18 h-18 rounded-full border-2 border-lime/30 flex items-center justify-center font-condensed font-900 text-lime text-lg mb-2 shadow-[0_0_8px_rgba(191,255,0,0.15)]">
                {score.value}
              </div>
              <span className="text-[0.62rem] text-axiom-muted font-condensed font-700 uppercase text-center leading-normal">
                {score.label}
              </span>
              <span className="text-[0.55rem] text-lime font-condensed font-600 uppercase mt-0.5">
                Benchmark: {score.benchmark} ({score.trend})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Grid: Interactive Diagram & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Interactive Joint Health Panel (5/12 cols) */}
        <div className="lg:col-span-5 bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-6">
              Joint Load & Kinematic Risk Analyzer
            </h3>

            {/* Selector list simulating body model points */}
            <div className="space-y-2 mb-6">
              {biomechanicsData.bodyZones.map(z => {
                const isSelected = selectedZone === z.zone;
                let dotColor = 'bg-lime';
                if (z.risk === 'high') dotColor = 'bg-red-500';
                else if (z.risk === 'moderate') dotColor = 'bg-amber-400';

                return (
                  <button
                    key={z.zone}
                    onClick={() => setSelectedZone(z.zone)}
                    className={`w-full flex items-center justify-between p-3 border transition-all text-left ${
                      isSelected
                        ? 'border-lime bg-lime/5'
                        : 'border-axiom-border bg-axiom-black/45 hover:border-axiom-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                      <span className="font-condensed font-700 text-xs tracking-wider text-axiom-white uppercase">
                        {zoneLabels[z.zone]}
                      </span>
                    </div>
                    <span className="font-condensed font-900 text-xs text-lime">
                      Score: {z.score}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Assessment Details */}
          <div className="bg-axiom-black/50 border border-axiom-border p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-condensed font-900 tracking-wider text-lime uppercase">
                {zoneLabels[activeZoneData.zone]} Assessment
              </span>
              <span className={`text-[0.55rem] font-condensed font-700 uppercase px-1.5 py-0.5 border ${
                activeZoneData.risk === 'high' ? 'border-red-500/30 text-red-400 bg-red-500/5' :
                activeZoneData.risk === 'moderate' ? 'border-amber-400/30 text-amber-400 bg-amber-400/5' : 'border-lime/30 text-lime bg-lime/5'
              }`}>
                {activeZoneData.risk} Risk
              </span>
            </div>
            <p className="text-xs text-axiom-muted leading-relaxed font-body">
              {zoneDescriptions[activeZoneData.zone]}
            </p>
          </div>
        </div>

        {/* Radar profile (7/12 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartWrapper title="Kinematic Profile Chart" badgeText="Lab Assessment">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" data={biomechanicsData.radarProfile}>
                <PolarGrid stroke="#222" />
                <PolarAngleAxis dataKey="metric" stroke="#666" fontSize={8} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#333" fontSize={8} />
                <Radar name="Athlete Score" dataKey="value" stroke="#BFFF00" fill="#BFFF00" fillOpacity={0.2} />
                <Radar name="Elite Benchmark" dataKey="benchmark" stroke="#666" fill="#666" fillOpacity={0.05} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <ChartWrapper title="Kinematic Quality Historical Trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={biomechanicsData.weeklyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                <Line type="monotone" name="Mechanics" dataKey="mechanics" stroke="#BFFF00" strokeWidth={2} />
                <Line type="monotone" name="Symmetry" dataKey="symmetry" stroke="#666" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>

      {/* Science Info panel */}
      <div className="bg-axiom-card border border-axiom-border p-4 flex gap-3 items-center">
        <Info size={16} className="text-lime flex-shrink-0" />
        <p className="text-xs text-axiom-muted font-body leading-relaxed">
          Dynamic symmetry metrics are generated via high-speed stride tracking. Asymmetry spikes &gt; 5% flag joint loading imbalances, helping coaches mitigate dynamic overload before soft tissue injury occurs.
        </p>
      </div>
    </PlatformLayout>
  );
}

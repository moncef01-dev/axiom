import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Activity, Zap,
  RefreshCw, ChevronRight, Clock, ShieldAlert
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import PlatformLayout from '../components/PlatformLayout';
import KPICard from '../components/KPICard';
import InsightBadge from '../components/InsightBadge';
import ChartWrapper from '../components/ChartWrapper';

import { useDashboardStore } from '../stores/useDashboardStore';
import { useAthleteStore } from '../stores/useAthleteStore';
import { generateTrainingLoadTrends } from '../utils/generateMockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { kpis, recentActivity, insights, refreshInsights } = useDashboardStore();
  const { athletes, selectAthlete } = useAthleteStore();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loadData] = useState(() => generateTrainingLoadTrends());

  const now = new Date();
  const dateString = now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleAthleteClick = (id: number) => {
    selectAthlete(id);
    navigate(`/athletes/${id}`);
  };

  const filteredInsights = activeCategory === 'All'
    ? insights
    : insights.filter(ins => ins.category === activeCategory);

  const categories = ['All', 'Performance', 'Recovery', 'Fatigue', 'Injury Risk', 'Training Load', 'Biomechanics'];

  const topAthletes = athletes.slice(0, 4);

  return (
    <PlatformLayout
      title="AXIOM Command Center"
      subtitle={`Welcome Back, Coach Aya  ·  ${dateString}`}
    >
      {/* 1. KPI Cards — first element visible after header */}
      <div className="mb-5">
        <p className="font-condensed font-700 text-[0.6rem] tracking-[3px] uppercase text-axiom-muted mb-3 flex items-center gap-2">
          <Activity size={11} className="text-lime" />
          Core Performance Indices
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPICard
            label="Performance Score"
            value={kpis.performanceScore.value}
            trend={kpis.performanceScore.trend}
            status={kpis.performanceScore.status as any}
            subtitle={kpis.performanceScore.comparison}
          />
          <KPICard
            label="Readiness Index"
            value={kpis.readinessScore.value}
            trend={kpis.readinessScore.trend}
            status={kpis.readinessScore.status as any}
            subtitle={kpis.readinessScore.comparison}
          />
          <KPICard
            label="Recovery State"
            value={kpis.recoveryScore.value}
            trend={kpis.recoveryScore.trend}
            status={kpis.recoveryScore.status as any}
            subtitle={kpis.recoveryScore.comparison}
            unit="%"
          />
          <KPICard
            label="Injury Risk"
            value={kpis.injuryRisk.value}
            trend={kpis.injuryRisk.trend}
            status={kpis.injuryRisk.status as any}
            subtitle={kpis.injuryRisk.comparison}
            unit="%"
          />
          <KPICard
            label="Weekly Load"
            value={kpis.weeklyLoad.value}
            trend={kpis.weeklyLoad.trend}
            status={kpis.weeklyLoad.status as any}
            subtitle={kpis.weeklyLoad.comparison}
            unit="AU"
          />
        </div>
      </div>

      {/* 2. Analytics Chart — full width */}
      <div className="mb-5">
        <ChartWrapper title="Weekly Workload Curve" badgeText="Load vs Target">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={loadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#BFFF00" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#666666" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#666666" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#666" fontSize={10} tickLine={false} />
              <YAxis stroke="#666" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '0px', fontFamily: 'Barlow, sans-serif', fontSize: '11px' }}
                itemStyle={{ color: '#F5F5F0' }}
                labelStyle={{ color: '#666', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}
              />
              <Area name="Actual Load" type="monotone" dataKey="actual" stroke="#BFFF00" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              <Area name="Target Load" type="monotone" dataKey="target" stroke="#666" strokeWidth={1} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* 3. AI Insights — below chart */}
      <div className="mb-5 bg-axiom-card border border-axiom-border p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-condensed font-700 text-xs tracking-[2px] uppercase text-axiom-white flex items-center gap-2">
            <Zap size={13} className="text-lime" />
            AXIOM AI Insights Engine
          </h3>
          <button
            onClick={refreshInsights}
            className="flex items-center gap-1.5 text-[0.65rem] tracking-wider uppercase text-axiom-muted hover:text-lime transition-colors border border-axiom-border px-2.5 py-1 hover:border-lime"
          >
            <RefreshCw size={10} />
            Re-Analyze
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mb-4 pb-3 border-b border-axiom-border/50">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[0.65rem] tracking-wider uppercase font-condensed font-600 transition-colors ${
                activeCategory === cat
                  ? 'bg-lime text-axiom-black font-700'
                  : 'text-axiom-muted hover:text-axiom-white hover:bg-axiom-border/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-1">
          {filteredInsights.length > 0 ? (
            filteredInsights.map(insight => (
              <InsightBadge key={insight.id} insight={insight} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-8 text-axiom-muted">
              <ShieldAlert size={24} className="mb-2 opacity-40" />
              <p className="text-xs uppercase tracking-wider">No active insights in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Squad Overview + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Top Athletes Table */}
        <div className="lg:col-span-8 bg-axiom-card border border-axiom-border p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-condensed font-700 text-xs tracking-[2px] uppercase text-axiom-white flex items-center gap-2">
              <Users size={13} className="text-lime" />
              Squad Overview
            </h3>
            <button
              onClick={() => navigate('/athletes')}
              className="text-[0.65rem] tracking-wider uppercase text-lime hover:text-axiom-white transition-colors flex items-center gap-0.5"
            >
              All Athletes <ChevronRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full platform-table">
              <thead>
                <tr>
                  <th>Athlete</th>
                  <th>Position</th>
                  <th className="text-center">Readiness</th>
                  <th className="text-center">Load (AU)</th>
                  <th className="text-center">Perf Score</th>
                  <th className="text-right">Risk Status</th>
                </tr>
              </thead>
              <tbody>
                {topAthletes.map(athlete => {
                  let riskColor = 'text-lime border-lime/20 bg-lime/5';
                  let riskText = 'Low';
                  if (athlete.riskScore >= 50) {
                    riskColor = 'text-red-400 border-red-400/20 bg-red-400/5';
                    riskText = 'High';
                  } else if (athlete.riskScore >= 20) {
                    riskColor = 'text-amber-400 border-amber-400/20 bg-amber-400/5';
                    riskText = 'Mod';
                  }
                  return (
                    <tr key={athlete.id} onClick={() => handleAthleteClick(athlete.id)} className="cursor-pointer">
                      <td className="flex items-center gap-3">
                        <img src={athlete.avatar} alt={athlete.name} className="w-8 h-8 rounded-none border border-axiom-border flex-shrink-0 object-cover" />
                        <div>
                          <p className="font-condensed font-700 text-xs tracking-wider text-axiom-white">{athlete.name}</p>
                          <p className="text-[0.65rem] text-axiom-muted tracking-wider uppercase">No. {athlete.jerseyNumber} · {athlete.nationality}</p>
                        </div>
                      </td>
                      <td className="text-xs uppercase text-axiom-muted font-condensed font-600">{athlete.position}</td>
                      <td className="text-center font-condensed font-900 text-sm text-lime">{athlete.readiness}%</td>
                      <td className="text-center font-condensed font-700 text-xs text-axiom-white">{athlete.trainingLoad}</td>
                      <td className="text-center font-condensed font-900 text-sm text-axiom-white">{athlete.performanceScore}</td>
                      <td className="text-right">
                        <span className={`text-[0.6rem] tracking-[1.5px] uppercase font-condensed font-700 px-2 py-0.5 border ${riskColor}`}>
                          {riskText} Risk
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-4 bg-axiom-card border border-axiom-border p-4 flex flex-col">
          <h3 className="font-condensed font-700 text-xs tracking-[2px] uppercase text-axiom-white flex items-center gap-2 mb-4">
            <Clock size={13} className="text-lime" />
            Live Activity Feed
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[280px] pr-1">
            {recentActivity.map(act => {
              let dotColor = 'bg-blue-400';
              if (act.severity === 'warning') dotColor = 'bg-amber-400';
              if (act.severity === 'success') dotColor = 'bg-lime';
              if (act.severity === 'danger' || act.severity === 'critical') dotColor = 'bg-red-500';
              return (
                <div key={act.id} className="flex gap-3 items-start text-xs border-b border-axiom-border/30 pb-3 last:border-b-0 last:pb-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-axiom-white leading-relaxed font-body">{act.message}</p>
                    <span className="text-[0.6rem] tracking-wider text-axiom-muted font-condensed font-700 uppercase mt-1 block">
                      {act.time} · {act.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
}

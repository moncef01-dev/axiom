import { useNavigate } from 'react-router-dom';
import { Trophy, ShieldAlert, Calendar, ArrowRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Cell, Pie } from 'recharts';

import PlatformLayout from '../components/PlatformLayout';
import ChartWrapper from '../components/ChartWrapper';
import KPICard from '../components/KPICard';

import teamsData from '../data/teams.json';
import { useAthleteStore } from '../stores/useAthleteStore';

export default function TeamPage() {
  const navigate = useNavigate();
  const { selectAthlete } = useAthleteStore();

  const { team, squadSummary, injurySummary, topPerformers, loadMonitoring, recoveryOverview, readinessDistribution } = teamsData;

  const handleAthleteClick = (id: number) => {
    selectAthlete(id);
    navigate(`/athletes/${id}`);
  };

  // Pie chart data for squad availability
  const availabilityData = [
    { name: 'Available', value: squadSummary.available, color: '#BFFF00' },
    { name: 'Resting', value: squadSummary.resting, color: '#f59e0b' },
    { name: 'Injured', value: squadSummary.injured, color: '#ef4444' },
  ];

  return (
    <PlatformLayout
      title="Team Dashboard"
      subtitle={`${team.name} · Ligue Professionnelle 1 · Squad Status and Load Aggregates`}
    >
      {/* 1. General Squad Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Team Readiness" value={`${squadSummary.readinessAverage}%`} status="good" subtitle="Squad readiness average" />
        <KPICard label="Team Performance" value={`${squadSummary.performanceAverage}`} status="good" subtitle="Performance rating average" />
        <KPICard label="Team Recovery score" value={`${squadSummary.recoveryAverage}%`} status="moderate" subtitle="HRV/Sleep quality average" />
        <KPICard label="Team Injury Risk" value={`${squadSummary.riskAverage}%`} status="low" subtitle="Overall average squad risk" />
      </div>

      {/* 2. Squad Availability & Injury summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Availability Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between h-full">
          <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-6">
            Squad Availability Ratios
          </h3>
          <div className="flex-1 min-h-[180px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={availabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={4}
                  dataKey="value"
                >
                  {availabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="font-condensed font-900 text-3xl text-axiom-white">{squadSummary.totalPlayers}</span>
              <span className="text-[0.6rem] text-axiom-muted uppercase tracking-wider block">Total Squad</span>
            </div>
          </div>
          <div className="flex justify-around mt-4 pt-3 border-t border-axiom-border/50 text-xs font-condensed">
            {availabilityData.map(item => (
              <div key={item.name} className="text-center">
                <span className="text-axiom-muted block uppercase">{item.name}</span>
                <span className="font-700 font-condensed" style={{ color: item.color }}>{item.value} Players</span>
              </div>
            ))}
          </div>
        </div>

        {/* Injury overview (4 cols) */}
        <div className="lg:col-span-4 bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white flex items-center gap-2 mb-4">
              <ShieldAlert size={13} className="text-red-500" />
              Active Injury / Return Roster
            </h3>
            <div className="space-y-3">
              {injurySummary.byZone.map((inj, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs pb-2.5 border-b border-axiom-border last:border-0 last:pb-0">
                  <span className="font-condensed font-700 text-axiom-white uppercase tracking-wider">{inj.zone} load-injury</span>
                  <span className={`text-[0.55rem] font-condensed font-700 uppercase px-1.5 py-0.5 border ${
                    inj.severity === 'severe' ? 'border-red-500/30 text-red-500 bg-red-500/5' :
                    inj.severity === 'moderate' ? 'border-amber-400/30 text-amber-400 bg-amber-400/5' : 'border-lime/30 text-lime bg-lime/5'
                  }`}>
                    {inj.severity} ({inj.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-axiom-black/50 border border-axiom-border p-3 mt-4">
            <h4 className="text-[0.65rem] font-condensed font-700 tracking-wider text-lime uppercase mb-1 flex items-center gap-1.5">
              <Calendar size={11} /> Project Returns
            </h4>
            {injurySummary.projectedReturns.map((ret, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between text-axiom-white font-condensed font-600 uppercase">
                  <span>{ret.player}</span>
                  <span className="text-lime">{ret.estimatedReturn}</span>
                </div>
                <p className="text-[0.65rem] text-axiom-muted font-body mt-0.5">
                  Rehabilitation status: {ret.status} ({ret.zone})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness distribution bar chart (4 cols) */}
        <div className="lg:col-span-4">
          <ChartWrapper title="Readiness Score Distribution" badgeText="Player Counts">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessDistribution} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                <Bar name="Players" dataKey="count" fill="#BFFF00" barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>

      {/* 3. Team Workload & Sleep/HRV Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Load monitoring stacked bar chart */}
        <ChartWrapper title="Team Load Monitoring vs Target Preset" badgeText="AU Workload Curve">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={loadMonitoring.weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'Barlow Condensed' }} />
              <Bar name="Team Load" dataKey="team" fill="#BFFF00" barSize={12} />
              <Bar name="Target Preset" dataKey="target" fill="#444" barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Sleep/HRV line trends */}
        <ChartWrapper title="Team Recovery Overview (Sleep & HRV)" badgeText="7-Day Averages">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recoveryOverview.teamHRV} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'Barlow Condensed' }} />
              <Line name="Avg HRV (ms)" type="monotone" dataKey="hrv" stroke="#BFFF00" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* 4. Squad Leaders / Top Performers */}
      <div className="bg-axiom-card border border-axiom-border p-5">
        <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white flex items-center gap-2 mb-6">
          <Trophy size={13} className="text-lime" />
          Squad Leaderboard (Top Rated Performers)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full platform-table">
            <thead>
              <tr>
                <th className="text-center">Rank</th>
                <th>Athlete</th>
                <th>Position</th>
                <th className="text-center">Performance Rating</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map(perf => (
                <tr
                  key={perf.athleteId}
                  onClick={() => handleAthleteClick(perf.athleteId)}
                  className="cursor-pointer"
                >
                  <td className="text-center font-condensed font-900 text-xs text-lime">
                    #{perf.rank}
                  </td>
                  <td className="flex items-center gap-3">
                    <img
                      src={perf.avatar}
                      alt={perf.name}
                      className="w-8 h-8 border border-axiom-border object-cover flex-shrink-0"
                    />
                    <span className="font-condensed font-700 text-xs tracking-wider text-axiom-white">
                      {perf.name}
                    </span>
                  </td>
                  <td className="text-xs uppercase text-axiom-muted font-condensed font-600">
                    {perf.position}
                  </td>
                  <td className="text-center font-condensed font-900 text-sm text-lime">
                    {perf.score} <span className="text-[0.6rem] font-600 text-lime tracking-normal ml-0.5">({perf.trend})</span>
                  </td>
                  <td className="text-right">
                    <button className="text-axiom-muted hover:text-lime p-1 transition-all">
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PlatformLayout>
  );
}

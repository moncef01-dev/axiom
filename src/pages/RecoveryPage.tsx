import { ShieldCheck, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import PlatformLayout from '../components/PlatformLayout';
import ChartWrapper from '../components/ChartWrapper';
import KPICard from '../components/KPICard';

import recoveryData from '../data/recovery.json';

export default function RecoveryPage() {
  const current = recoveryData.current;

  return (
    <PlatformLayout
      title="Recovery Monitoring"
      subtitle="Sleep analysis, HRV tracking, hydration index, and neuromuscular fatigue metrics"
    >
      {/* 4 Core Recovery Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="Sleep Duration" value={current.sleepHours} unit="hr" status={current.sleepHours >= 7.5 ? 'optimal' : 'moderate'} />
        <KPICard label="Heart Rate Var (HRV)" value={current.hrv} unit="ms" status={current.hrv >= 60 ? 'optimal' : 'moderate'} />
        <KPICard label="Hydration Score" value={current.hydration} unit="%" status={current.hydration >= 85 ? 'optimal' : 'moderate'} />
        <KPICard label="Fatigue Index" value={current.fatigue} unit="%" status={current.fatigue <= 30 ? 'low' : 'high'} />
      </div>

      {/* Grid: 7-Day Trend Chart & Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Recovery trend Area Chart (7/12 cols) */}
        <div className="lg:col-span-7">
          <ChartWrapper title="7-Day Recovery & Readiness Trend" badgeText="Telemetry Tracking">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recoveryData.weeklyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecCurve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#BFFF00" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} domain={[30, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                <Area name="Recovery Score" type="monotone" dataKey="recovery" stroke="#BFFF00" strokeWidth={2} fillOpacity={1} fill="url(#colorRecCurve)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Strategy Advisories Panel (5/12 cols) */}
        <div className="lg:col-span-5 bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white flex items-center gap-2">
                <ShieldCheck size={13} className="text-lime" />
                Recovery Strategy Advisories
              </h3>
              <span className="text-[0.6rem] font-condensed font-700 tracking-wider text-lime uppercase border border-lime/30 px-2 py-0.5 bg-lime/5">
                Readiness: {recoveryData.readinessStatus}
              </span>
            </div>

            <div className="space-y-4">
              {recoveryData.recommendations.map((rec, idx) => {
                let badgeColor = 'text-lime border-lime/20 bg-lime/5';
                if (rec.priority === 'high') {
                  badgeColor = 'text-red-400 border-red-400/20 bg-red-400/5';
                } else if (rec.priority === 'medium') {
                  badgeColor = 'text-amber-400 border-amber-400/20 bg-amber-400/5';
                }

                return (
                  <div key={idx} className="flex gap-3 items-start border-b border-axiom-border/30 pb-3.5 last:border-b-0 last:pb-0">
                    <span className={`text-[0.55rem] font-condensed font-700 uppercase px-1.5 py-0.5 border flex-shrink-0 mt-0.5 ${badgeColor}`}>
                      {rec.priority}
                    </span>
                    <p className="text-xs text-axiom-white leading-relaxed font-body">
                      {rec.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-axiom-border flex justify-between text-xs text-axiom-muted">
            <span>Resting HR: {current.restingHR} bpm</span>
            <span>Sleep Quality: {current.sleepQuality}%</span>
            <span>Muscle Soreness: {current.muscleSoreness}/10</span>
          </div>
        </div>
      </div>

      {/* Info Warning */}
      <div className="bg-axiom-card border border-axiom-border p-4 flex gap-3 items-center">
        <Info size={16} className="text-lime flex-shrink-0" />
        <p className="text-xs text-axiom-muted font-body leading-relaxed">
          HRV metrics are tracked overnight via wearable device sensors. dHRV dips below the 7-day trailing average indicate systemic fatigue, and workload adjustments should be made to prevent acute muscle stress.
        </p>
      </div>
    </PlatformLayout>
  );
}

import { Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import PlatformLayout from '../components/PlatformLayout';
import ChartWrapper from '../components/ChartWrapper';
import KPICard from '../components/KPICard';

import injuryData from '../data/injury.json';

export default function InjuryRiskPage() {
  const overall = injuryData.overall;

  return (
    <PlatformLayout
      title="Injury Risk Assessment"
      subtitle="Biomechanical risk factors, workload loading indices, and preventive clinical indicators"
    >
      {/* Risk Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <KPICard label="Overall Injury Risk" value={`${overall.score}%`} status={overall.level as any} subtitle={overall.label} large={true} />
        <div className="md:col-span-2 bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-3">
              Injury Mitigation Protocol
            </h3>
            <p className="text-xs text-axiom-muted leading-relaxed mb-4">
              Preventive sports medicine protocols are dynamically activated based on workload triggers. Current overall risk is low at 12%, but hamstring overload indicators suggest eccentric strengthening adjustments.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-axiom-border">
            {injuryData.recommendations.slice(0, 2).map((rec, idx) => (
              <div key={idx} className="flex gap-2 items-start text-xs text-axiom-white font-body leading-normal">
                <span className="text-lime mt-0.5">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Risk Factors & Zone Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Risk Factors List (5/12 cols) */}
        <div className="lg:col-span-5 bg-axiom-card border border-axiom-border p-5">
          <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
            Identified Risk Factors
          </h3>
          <div className="space-y-4">
            {injuryData.riskFactors.map((f, idx) => {
              let impactColor = 'text-lime border-lime/20 bg-lime/5';
              if (f.impact === 'high') {
                impactColor = 'text-red-400 border-red-400/20 bg-red-400/5';
              } else if (f.impact === 'moderate') {
                impactColor = 'text-amber-400 border-amber-400/20 bg-amber-400/5';
              }

              return (
                <div key={idx} className="border-b border-axiom-border/30 pb-3.5 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1 font-condensed">
                    <span className="text-xs font-700 tracking-wider text-axiom-white uppercase">{f.factor}</span>
                    <span className={`text-[0.55rem] font-700 uppercase px-1.5 py-0.5 border ${impactColor}`}>
                      {f.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-axiom-muted leading-relaxed font-body">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone risk indicators & historical trends (7/12 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartWrapper title="Weekly Risk Trend Profile">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={injuryData.weeklyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} domain={[0, 30]} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #222', fontSize: '11px' }} />
                <Line type="monotone" name="Overall Risk" dataKey="overall" stroke="#BFFF00" strokeWidth={2} />
                <Line type="monotone" name="Hamstring" dataKey="hamstring" stroke="#666" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <div className="bg-axiom-card border border-axiom-border p-5">
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-4">
              Localised Risk Assessment
            </h3>
            <div className="space-y-4">
              {injuryData.zones.map((z, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1 font-condensed">
                    <span className="text-axiom-muted font-600 uppercase">{z.zone}</span>
                    <span className="text-axiom-white font-700" style={{ color: z.color }}>
                      {z.score}% ({z.level})
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

      {/* Warning */}
      <div className="bg-axiom-card border border-axiom-border p-4 flex gap-3 items-center">
        <Info size={16} className="text-lime flex-shrink-0" />
        <p className="text-xs text-axiom-muted font-body leading-relaxed">
          Injury Risk is estimated using predictive load models. Large spikes in training intensity or chronic asymmetry triggers dynamic preventive recommendations to secure squad health and longevity.
        </p>
      </div>
    </PlatformLayout>
  );
}

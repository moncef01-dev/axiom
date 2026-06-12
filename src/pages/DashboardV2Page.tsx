import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart2, Zap, Heart,
  AlertTriangle, FileText, Trophy, Watch, Settings,
  Search, Bell, Mail, Calendar, Activity, ChevronDown
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

/* ─── Mock Data ─────────────────────────────────────────────────── */
const sparkPerf      = [{ v:82 },{ v:83 },{ v:85 },{ v:84 },{ v:87 }];
const sparkReady     = [{ v:79 },{ v:81 },{ v:80 },{ v:81 },{ v:82 }];
const sparkRecovery  = [{ v:82 },{ v:80 },{ v:79 },{ v:77 },{ v:78 }];
const sparkInjury    = [{ v:15 },{ v:14 },{ v:13 },{ v:12 },{ v:12 }];

const perfData = [
  { d:'May 12', Speed:72, Endurance:85, Power:68, Agility:74 },
  { d:'May 13', Speed:78, Endurance:83, Power:71, Agility:77 },
  { d:'May 14', Speed:75, Endurance:88, Power:73, Agility:79 },
  { d:'May 15', Speed:82, Endurance:84, Power:79, Agility:81 },
  { d:'May 16', Speed:88, Endurance:81, Power:83, Agility:85 },
  { d:'May 17', Speed:84, Endurance:82, Power:81, Agility:87 },
  { d:'May 18', Speed:87, Endurance:78, Power:85, Agility:84 },
];

const loadData = [
  { d:'Mon', v:80 },{ d:'Tue', v:95 },{ d:'Wed', v:115 },
  { d:'Thu', v:85 },{ d:'Fri', v:105 },{ d:'Sat', v:125 },{ d:'Sun', v:40 },
];

const hrvData = [
  { d:'Mon', v:57 },{ d:'Tue', v:59 },{ d:'Wed', v:62 },
  { d:'Thu', v:60 },{ d:'Fri', v:64 },{ d:'Sat', v:61 },{ d:'Sun', v:62 },
];

const insights = [
  { id:1, color:'#5BFF73', title:'Sprint performance improved by 6.2%',  desc:'Great progress. Keep maintaining your current training intensity.' },
  { id:2, color:'#FFC400', title:'Elevated training load detected',       desc:'Training load increased by 18% compared to last week.' },
  { id:3, color:'#FF5B5B', title:'Recovery below optimal',                desc:'Recovery score below threshold. Consider additional rest.' },
  { id:4, color:'#5BFF73', title:'High intensity session recommended',    desc:'Athlete ready for high intensity training.' },
];

const activities = [
  { id:1, label:'High Intensity Training', when:'May 18, 2024 · 09:30 AM', Icon:Zap },
  { id:2, label:'Speed Test',              when:'May 17, 2024 · 02:15 PM', Icon:Activity },
  { id:3, label:'Recovery Session',        when:'May 16, 2024 · 11:00 AM', Icon:Heart },
  { id:4, label:'Strength Training',       when:'May 15, 2024 · 04:30 PM', Icon:Trophy },
];

const navItems = [
  { to:'/dashboard-v2', Icon:LayoutDashboard, label:'Dashboard',   active:true  },
  { to:'/athletes',     Icon:Users,           label:'Athletes',    active:false },
  { to:'/analytics',    Icon:BarChart2,       label:'Analytics',   active:false },
  { to:'/biomechanics', Icon:Zap,             label:'Biomechanics',active:false },
  { to:'/recovery',     Icon:Heart,           label:'Recovery',    active:false },
  { to:'/injury-risk',  Icon:AlertTriangle,   label:'Injury Risk', active:false },
  { to:'/reports',      Icon:FileText,        label:'Reports',     active:false },
  { to:'/teams',        Icon:Trophy,          label:'Team',        active:false },
  { to:'/wearables',    Icon:Watch,           label:'Wearables',   active:false },
  { to:'/settings',     Icon:Settings,        label:'Settings',    active:false },
];

/* ─── Shared card style ─────────────────────────────────────────── */
const card = 'bg-[#10151C] border border-[rgba(255,255,255,0.08)] rounded-[12px] p-4';

/* ─── Tiny sparkline ────────────────────────────────────────────── */
function Spark({ data, color }: { data: {v:number}[]; color: string }) {
  return (
    <div className="h-8 flex-1 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top:2, right:2, left:2, bottom:2 }}>
          <Line type="monotone" dataKey="v" stroke={color}
                strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function DashboardV2Page() {
  return (
    <div style={{ fontFamily:'Inter, sans-serif', background:'#050505',
      backgroundImage:'radial-gradient(circle at 50% 0%, rgba(40,70,120,0.08) 0%, #050505 75%)',
      minHeight:'100vh', color:'#fff' }}>

      {/* Inter font (scoped — does NOT affect global platform) */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── SIDEBAR (fixed 200 px) ─────────────────────────────── */}
      <aside style={{ position:'fixed', top:0, left:0, width:200, height:'100vh',
                      zIndex:50, background:'#10151C',
                      borderRight:'1px solid rgba(255,255,255,0.08)',
                      display:'flex', flexDirection:'column', justifyContent:'space-between',
                      padding:'16px' }}>

        {/* top: logo + nav */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {/* Logo */}
          <div>
            <div style={{ fontWeight:800, fontSize:20, letterSpacing:3 }}>
              AXI<span style={{ color:'#C6FF00' }}>OM</span>
            </div>
            <div style={{ fontSize:9, color:'#6B7280', fontWeight:600,
                          textTransform:'uppercase', letterSpacing:0.5,
                          lineHeight:1.4, marginTop:2 }}>
              Where Movement<br/>Meets Intelligence
            </div>
          </div>

          {/* Nav */}
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {navItems.map(({ to, Icon, label, active }) => (
              <Link key={to} to={to} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'8px 12px', borderRadius:8, fontSize:12, fontWeight:600,
                textDecoration:'none',
                background: active ? '#C6FF00' : 'transparent',
                color:       active ? '#050505' : '#9CA3AF',
                transition:'all .15s',
              }}>
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* bottom: coach avatar */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:12,
                      display:'flex', alignItems:'center', gap:8 }}>
          <img src="/avatars/athlete-01.jpg"
               style={{ width:32, height:32, borderRadius:'50%',
                        border:'1px solid rgba(255,255,255,0.1)', objectFit:'cover', flexShrink:0 }}
               alt="Coach" />
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:11, fontWeight:600, color:'#fff',
                        lineHeight:1.2, margin:0, overflow:'hidden',
                        whiteSpace:'nowrap', textOverflow:'ellipsis' }}>Yacine Benali</p>
            <p style={{ fontSize:9, color:'#6B7280', fontWeight:600,
                        textTransform:'uppercase', letterSpacing:1,
                        lineHeight:1.2, margin:0 }}>Coach</p>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT (offset by sidebar) ──────────────────── */}
      <main style={{ marginLeft:200, padding:24, display:'flex',
                     flexDirection:'column', gap:16, minHeight:'100vh' }}>

        {/* ── HEADER ───────────────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'center',
                      justifyContent:'space-between', width:'100%' }}>
          {/* Left */}
          <div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:600,
                         letterSpacing:-0.3, lineHeight:1 }}>Dashboard</h1>
            <p style={{ margin:'4px 0 0', fontSize:11, color:'#9CA3AF' }}>
              Welcome back, Coach 👋
            </p>
          </div>

          {/* Centre – search */}
          <div style={{ position:'relative', width:240 }}>
            <Search size={12} style={{ position:'absolute', left:10,
              top:'50%', transform:'translateY(-50%)', color:'#6B7280' }} />
            <input placeholder="Search athletes..." style={{
              width:'100%', background:'#10151C', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:8, padding:'6px 12px 6px 30px', fontSize:12,
              color:'#fff', outline:'none', boxSizing:'border-box'
            }} />
          </div>

          {/* Right – icons + date */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ background:'none', border:'none', color:'#9CA3AF',
                             cursor:'pointer', padding:4, display:'flex' }}>
              <Bell size={15} />
            </button>
            <button style={{ background:'none', border:'none', color:'#9CA3AF',
                             cursor:'pointer', padding:4, display:'flex' }}>
              <Mail size={15} />
            </button>
            <img src="/avatars/athlete-01.jpg"
                 style={{ width:26, height:26, borderRadius:'50%',
                          border:'1px solid rgba(255,255,255,0.1)', objectFit:'cover' }}
                 alt="User" />
            <div style={{ display:'flex', alignItems:'center', gap:6,
                          padding:'5px 10px', background:'#10151C',
                          border:'1px solid rgba(255,255,255,0.08)',
                          borderRadius:8, fontSize:11, fontWeight:500, color:'#fff' }}>
              <Calendar size={11} style={{ color:'#6B7280' }} />
              <span>May 12 – May 18, 2024</span>
              <ChevronDown size={11} style={{ color:'#6B7280' }} />
            </div>
          </div>
        </div>

        {/* ── KPI ROW (4 cards) ─────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>

          {/* Performance Score */}
          <div className={card} style={{ height:128, minHeight:128, maxHeight:128,
                                         display:'flex', flexDirection:'column',
                                         justifyContent:'space-between' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF' }}>Performance Score</span>
              <div style={{ width:20, height:20, borderRadius:'50%',
                            background:'rgba(255,255,255,0.04)',
                            border:'1px solid rgba(255,255,255,0.1)',
                            display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Activity size={10} style={{ color:'#6B7280' }} />
              </div>
            </div>
            <div style={{ fontSize:22, fontWeight:700, lineHeight:1 }}>87 / 100</div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#5BFF73', flexShrink:0 }}>+6%</span>
              <Spark data={sparkPerf} color="#5BFF73" />
            </div>
          </div>

          {/* Readiness Score */}
          <div className={card} style={{ height:128, minHeight:128, maxHeight:128,
                                         display:'flex', flexDirection:'column',
                                         justifyContent:'space-between' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF' }}>Readiness Score</span>
              <div style={{ width:20, height:20, borderRadius:'50%',
                            background:'rgba(255,255,255,0.04)',
                            border:'1px solid rgba(255,255,255,0.1)',
                            display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Zap size={10} style={{ color:'#6B7280' }} />
              </div>
            </div>
            <div style={{ fontSize:22, fontWeight:700, lineHeight:1 }}>82 / 100</div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#FFC400', flexShrink:0 }}>+4%</span>
              <Spark data={sparkReady} color="#FFC400" />
            </div>
          </div>

          {/* Recovery Score */}
          <div className={card} style={{ height:128, minHeight:128, maxHeight:128,
                                         display:'flex', flexDirection:'column',
                                         justifyContent:'space-between' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF' }}>Recovery Score</span>
              <div style={{ width:20, height:20, borderRadius:'50%',
                            background:'rgba(255,255,255,0.04)',
                            border:'1px solid rgba(255,255,255,0.1)',
                            display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Heart size={10} style={{ color:'#6B7280' }} />
              </div>
            </div>
            <div style={{ fontSize:22, fontWeight:700, lineHeight:1 }}>78 / 100</div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#FFC400', flexShrink:0 }}>-2%</span>
              <Spark data={sparkRecovery} color="#FF8A00" />
            </div>
          </div>

          {/* Injury Risk */}
          <div className={card} style={{ height:128, minHeight:128, maxHeight:128,
                                         display:'flex', flexDirection:'column',
                                         justifyContent:'space-between' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF' }}>Injury Risk</span>
              <div style={{ width:20, height:20, borderRadius:'50%',
                            background:'rgba(255,255,255,0.04)',
                            border:'1px solid rgba(255,255,255,0.1)',
                            display:'flex', alignItems:'center', justifyContent:'center' }}>
                <AlertTriangle size={10} style={{ color:'#6B7280' }} />
              </div>
            </div>
            <div style={{ fontSize:22, fontWeight:700, lineHeight:1 }}>12%</div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#5BFF73', flexShrink:0 }}>Low Risk</span>
              <Spark data={sparkInjury} color="#FF5B5B" />
            </div>
          </div>
        </div>

        {/* ── MIDDLE ROW: chart (65%) + insights (35%) ─────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'8fr 4fr',
                      gap:16, height:400 }}>

          {/* Performance Overview */}
          <div className={card} style={{ display:'flex', flexDirection:'column',
                                         height:'100%', overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between',
                          alignItems:'center', marginBottom:8, flexShrink:0 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Performance Overview</span>
              <div style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 8px',
                            background:'rgba(255,255,255,0.04)',
                            border:'1px solid rgba(255,255,255,0.08)',
                            borderRadius:6, fontSize:10, fontWeight:500,
                            color:'#9CA3AF', cursor:'pointer' }}>
                <span>This Week</span>
                <ChevronDown size={10} />
              </div>
            </div>

            <div style={{ flex:1, minHeight:0 }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={perfData} margin={{ top:8, right:8, left:-25, bottom:4 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="d" stroke="#4B5563" fontSize={9}
                         tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={9} tickLine={false}
                         axisLine={false} domain={[50,100]} />
                  <Line type="monotone" dataKey="Speed"     stroke="#C6FF00" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="Endurance" stroke="#F5D90A" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="Power"     stroke="#29D3FF" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="Agility"   stroke="#A855F7" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div style={{ display:'flex', justifyContent:'center', gap:20,
                          fontSize:10, color:'#9CA3AF', flexShrink:0, paddingTop:4 }}>
              {[['#C6FF00','Speed'],['#F5D90A','Endurance'],['#29D3FF','Power'],['#A855F7','Agility']].map(([c,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:10, height:3, borderRadius:2, background:c, display:'inline-block' }} />
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className={card} style={{ display:'flex', flexDirection:'column',
                                         height:'100%', overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between',
                          alignItems:'center', marginBottom:12, flexShrink:0 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>AI Insights</span>
              <span style={{ fontSize:11, fontWeight:600, color:'#C6FF00', cursor:'pointer' }}>View All</span>
            </div>

            <div style={{ flex:1, display:'flex', flexDirection:'column',
                          gap:8, overflowY:'auto' }}>
              {insights.map(({ id, color, title, desc }) => (
                <div key={id} style={{ display:'flex', alignItems:'flex-start', gap:10,
                                       padding:10, borderRadius:8,
                                       background:'rgba(255,255,255,0.02)',
                                       border:'1px solid rgba(255,255,255,0.04)',
                                       flexShrink:0 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%',
                                background:color, marginTop:3, flexShrink:0 }} />
                  <div>
                    <p style={{ margin:0, fontSize:11, fontWeight:600,
                                lineHeight:1.35, color:'#fff' }}>{title}</p>
                    <p style={{ margin:'3px 0 0', fontSize:10, color:'#9CA3AF',
                                lineHeight:1.4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: activities | load | HRV ──────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                      gap:16 }}>

          {/* Recent Activities */}
          <div className={card} style={{ height:250, display:'flex',
                                          flexDirection:'column' }}>
            <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF',
                           marginBottom:8, flexShrink:0 }}>Recent Activities</span>
            <div style={{ flex:1, display:'flex', flexDirection:'column',
                          justifyContent:'space-between', overflow:'hidden' }}>
              {activities.map(({ id, label, when, Icon: Ic }, idx) => (
                <div key={id} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  paddingTop: idx === 0 ? 0 : 6, paddingBottom: idx === activities.length-1 ? 0 : 6,
                  borderBottom: idx < activities.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                    <div style={{ width:24, height:24, borderRadius:'50%',
                                  background:'rgba(255,255,255,0.04)',
                                  border:'1px solid rgba(255,255,255,0.08)',
                                  display:'flex', alignItems:'center', justifyContent:'center',
                                  flexShrink:0, color:'#9CA3AF' }}>
                      <Ic size={11} />
                    </div>
                    <div style={{ minWidth:0 }}>
                      <p style={{ margin:0, fontSize:11, fontWeight:600,
                                  color:'#fff', lineHeight:1.2,
                                  overflow:'hidden', whiteSpace:'nowrap',
                                  textOverflow:'ellipsis' }}>{label}</p>
                      <p style={{ margin:'2px 0 0', fontSize:10, color:'#6B7280',
                                  lineHeight:1.2 }}>{when}</p>
                    </div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:'#5BFF73',
                                 background:'rgba(91,255,115,0.08)',
                                 border:'1px solid rgba(91,255,115,0.2)',
                                 padding:'2px 6px', borderRadius:4,
                                 textTransform:'uppercase', letterSpacing:0.5,
                                 flexShrink:0, marginLeft:8 }}>Completed</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Training Load */}
          <div className={card} style={{ height:250, display:'flex',
                                          flexDirection:'column' }}>
            <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF',
                           marginBottom:4, flexShrink:0 }}>Weekly Training Load</span>
            <div style={{ display:'flex', alignItems:'baseline', gap:6,
                          flexShrink:0, marginBottom:4 }}>
              <span style={{ fontSize:24, fontWeight:700, lineHeight:1 }}>645</span>
              <span style={{ fontSize:10, color:'#6B7280', fontWeight:600,
                             textTransform:'uppercase', letterSpacing:0.5 }}>Total Load</span>
            </div>
            <div style={{ flex:1, minHeight:0 }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={loadData} margin={{ top:4, right:0, left:-25, bottom:0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="d" stroke="#4B5563" fontSize={9}
                         tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={9} tickLine={false} axisLine={false} />
                  <Bar dataKey="v" fill="#C6FF00" radius={[2,2,0,0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Heart Rate Variability */}
          <div className={card} style={{ height:250, display:'flex',
                                          flexDirection:'column' }}>
            <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF',
                           marginBottom:4, flexShrink:0 }}>Heart Rate Variability</span>
            <div style={{ display:'flex', justifyContent:'space-between',
                          alignItems:'baseline', flexShrink:0, marginBottom:4 }}>
              <span style={{ fontSize:24, fontWeight:700, lineHeight:1 }}>62 ms</span>
              <span style={{ fontSize:10, fontWeight:700, color:'#5BFF73',
                             background:'rgba(91,255,115,0.08)',
                             border:'1px solid rgba(91,255,115,0.2)',
                             padding:'2px 8px', borderRadius:4,
                             textTransform:'uppercase', lineHeight:1 }}>Good</span>
            </div>
            <div style={{ flex:1, minHeight:0 }}>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={hrvData} margin={{ top:4, right:4, left:-25, bottom:0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="d" stroke="#4B5563" fontSize={9}
                         tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={9} tickLine={false}
                         axisLine={false} domain={['dataMin - 2','dataMax + 2']} />
                  <Line type="monotone" dataKey="v" stroke="#5BFF73"
                        strokeWidth={1.8} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

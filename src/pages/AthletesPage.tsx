import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight, UserPlus, Users } from 'lucide-react';
import PlatformLayout from '../components/PlatformLayout';
import RiskBadge from '../components/RiskBadge';
import { useAthleteStore } from '../stores/useAthleteStore';

export default function AthletesPage() {
  const navigate = useNavigate();
  const { athletes, selectAthlete } = useAthleteStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleRowClick = (id: number) => {
    selectAthlete(id);
    navigate(`/athletes/${id}`);
  };

  // Filter athletes based on search term and status filter
  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          athlete.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          athlete.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || athlete.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <PlatformLayout
      title="Athlete Roster"
      subtitle="Comprehensive profiles and real-time status of all active squad members"
    >
      {/* Roster Controls */}
      <div className="bg-axiom-card border border-axiom-border p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, position..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-axiom-black border border-axiom-border pl-10 pr-4 py-2 text-xs text-axiom-white outline-none focus:border-lime tracking-wider font-condensed font-600 placeholder-axiom-muted"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-axiom-muted" />
        </div>

        {/* Filters & Actions */}
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Filter size={12} className="text-axiom-muted" />
            <span className="text-[0.6rem] uppercase tracking-wider text-axiom-muted font-condensed font-600 mr-2">Status:</span>
            {['all', 'active', 'resting', 'injured'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-[0.6rem] tracking-wider uppercase font-condensed font-700 transition-colors border ${
                  statusFilter === status
                    ? 'bg-lime text-axiom-black border-lime'
                    : 'text-axiom-muted border-axiom-border hover:text-axiom-white hover:border-axiom-muted'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 bg-axiom-border border border-axiom-border text-axiom-muted hover:text-lime hover:border-lime transition-all px-3 py-1.5 text-[0.65rem] tracking-widest font-condensed font-700 uppercase">
            <UserPlus size={12} />
            Register Athlete
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-axiom-card border border-axiom-border p-5">
        {filteredAthletes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full platform-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Sport</th>
                  <th>Position</th>
                  <th className="text-center">Age</th>
                  <th className="text-center">Readiness</th>
                  <th className="text-center">Perf Score</th>
                  <th className="text-center">Risk Factor</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAthletes.map(athlete => {
                  let statusBg = 'border-lime/30 text-lime bg-lime/5';
                  if (athlete.status === 'resting') {
                    statusBg = 'border-amber-400/30 text-amber-400 bg-amber-400/5';
                  } else if (athlete.status === 'injured') {
                    statusBg = 'border-red-500/30 text-red-500 bg-red-500/5';
                  }

                  return (
                    <tr
                      key={athlete.id}
                      onClick={() => handleRowClick(athlete.id)}
                      className="cursor-pointer transition-colors"
                    >
                      <td>
                        <img
                          src={athlete.avatar}
                          alt={athlete.name}
                          className="w-10 h-10 border border-axiom-border object-cover flex-shrink-0"
                        />
                      </td>
                      <td>
                        <p className="font-condensed font-700 text-xs tracking-wider text-axiom-white">
                          {athlete.name}
                        </p>
                        <p className="text-[0.65rem] text-axiom-muted tracking-wider uppercase">
                          No. {athlete.jerseyNumber} · {athlete.nationality}
                        </p>
                      </td>
                      <td className="text-xs uppercase text-axiom-muted font-condensed font-600">
                        {athlete.sport}
                      </td>
                      <td className="text-xs uppercase text-axiom-muted font-condensed font-600">
                        {athlete.position}
                      </td>
                      <td className="text-center font-condensed font-700 text-xs text-axiom-white">
                        {athlete.age}
                      </td>
                      <td className="text-center font-condensed font-900 text-sm text-lime">
                        {athlete.readiness}%
                      </td>
                      <td className="text-center font-condensed font-900 text-sm text-axiom-white">
                        {athlete.performanceScore > 0 ? athlete.performanceScore : '-'}
                      </td>
                      <td className="text-center">
                        <RiskBadge level={athlete.riskScore >= 50 ? 'high' : athlete.riskScore >= 20 ? 'moderate' : 'low'} />
                      </td>
                      <td className="text-center">
                        <span className={`text-[0.6rem] tracking-[1.5px] uppercase font-condensed font-700 px-2 py-0.5 border ${statusBg}`}>
                          {athlete.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button className="text-axiom-muted hover:text-lime transition-colors p-1">
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-axiom-muted">
            <Users size={40} className="mb-3 opacity-30" />
            <h4 className="font-condensed font-700 text-sm tracking-[2px] uppercase text-axiom-white mb-1">
              No Athletes Found
            </h4>
            <p className="text-xs max-w-xs text-center">
              Try adjusting your search criteria or resetting status filters.
            </p>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}

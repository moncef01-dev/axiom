import React, { useState } from 'react';
import { User, Mail, Phone, Award, Shield, Save } from 'lucide-react';

import PlatformLayout from '../components/PlatformLayout';
import userData from '../data/user.json';

export default function SettingsPage() {
  const [profile, setProfile] = useState(() => userData);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotes, setPushNotes] = useState(true);
  const [measurementUnit, setMeasurementUnit] = useState<'metric' | 'imperial'>('metric');
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1200);
  };

  return (
    <PlatformLayout
      title="System Settings"
      subtitle="Configure profile parameters, notification preferences, and telemetry standards"
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Profile Details Widget */}
        <div className="bg-axiom-card border border-axiom-border p-6">
          <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-6 flex items-center gap-2">
            <User size={13} className="text-lime" />
            User Profile Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[0.65rem] tracking-[2px] uppercase text-axiom-muted mb-2 font-condensed font-700">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-axiom-black border border-axiom-border px-4 py-2.5 text-xs text-axiom-white placeholder-axiom-muted outline-none focus:border-lime transition-colors tracking-wide font-condensed font-600"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] tracking-[2px] uppercase text-axiom-muted mb-2 font-condensed font-700">
                Role / Title
              </label>
              <input
                type="text"
                value={profile.role}
                readOnly
                className="w-full bg-axiom-black border border-axiom-border/50 px-4 py-2.5 text-xs text-axiom-muted outline-none tracking-wide font-condensed font-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] tracking-[2px] uppercase text-axiom-muted mb-2 font-condensed font-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-axiom-black border border-axiom-border px-4 py-2.5 text-xs text-axiom-white placeholder-axiom-muted outline-none focus:border-lime transition-colors tracking-wide font-condensed font-600 pl-10"
                />
                <Mail size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-axiom-muted" />
              </div>
            </div>

            <div>
              <label className="block text-[0.65rem] tracking-[2px] uppercase text-axiom-muted mb-2 font-condensed font-700">
                Contact Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-axiom-black border border-axiom-border px-4 py-2.5 text-xs text-axiom-white placeholder-axiom-muted outline-none focus:border-lime transition-colors tracking-wide font-condensed font-600 pl-10"
                />
                <Phone size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-axiom-muted" />
              </div>
            </div>
          </div>

          {/* Licenses and Certifications info */}
          <div className="mt-6 pt-6 border-t border-axiom-border grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <Award size={20} className="text-lime flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-condensed font-700 text-xs tracking-wider text-axiom-white uppercase mb-1">
                  Coaching License
                </h4>
                <p className="text-xs text-axiom-muted">{profile.license} · {profile.experience} active experience</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield size={20} className="text-lime flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-condensed font-700 text-xs tracking-wider text-axiom-white uppercase mb-1">
                  Certifications Registry
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {profile.certifications.map(cert => (
                    <span
                      key={cert}
                      className="bg-axiom-black text-axiom-muted border border-axiom-border text-[0.55rem] font-condensed font-600 uppercase px-2 py-0.5"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings & Customization Preferences */}
        <div className="bg-axiom-card border border-axiom-border p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notifications Panel */}
          <div>
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-5">
              Notification Rules
            </h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="mt-1 accent-lime"
                />
                <div>
                  <span className="text-xs font-condensed font-700 tracking-wider uppercase text-axiom-white block">Email Digests</span>
                  <span className="text-[0.65rem] text-axiom-muted">Send daily summary reports and threshold alerts to coach email.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotes}
                  onChange={e => setPushNotes(e.target.checked)}
                  className="mt-1 accent-lime"
                />
                <div>
                  <span className="text-xs font-condensed font-700 tracking-wider uppercase text-axiom-white block">Real-time Push Alerts</span>
                  <span className="text-[0.65rem] text-axiom-muted">Display desktop alerts for high fatigue and injury risk spikes.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Unit Standards Panel */}
          <div>
            <h3 className="font-condensed font-700 text-xs tracking-[1.5px] uppercase text-axiom-white mb-5">
              Measurement Standards
            </h3>
            <div className="space-y-4 text-xs font-condensed font-700 uppercase tracking-wider text-axiom-muted">
              <div>
                <label className="block text-[0.65rem] tracking-[2px] uppercase text-axiom-muted mb-2 font-condensed font-700">
                  Telemetry Units
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMeasurementUnit('metric')}
                    className={`px-3 py-1.5 border text-[0.65rem] transition-all font-condensed ${
                      measurementUnit === 'metric'
                        ? 'border-lime text-lime bg-lime/5'
                        : 'border-axiom-border text-axiom-muted hover:text-axiom-white hover:border-axiom-muted'
                    }`}
                  >
                    Metric (km/h, meters, kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeasurementUnit('imperial')}
                    className={`px-3 py-1.5 border text-[0.65rem] transition-all font-condensed ${
                      measurementUnit === 'imperial'
                        ? 'border-lime text-lime bg-lime/5'
                        : 'border-axiom-border text-axiom-muted hover:text-axiom-white hover:border-axiom-muted'
                    }`}
                  >
                    Imperial (mph, yards, lbs)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform details (Read Only metadata) */}
        <div className="bg-axiom-card border border-axiom-border p-5 text-[0.65rem] text-axiom-muted space-y-1 font-condensed uppercase">
          <span className="text-[0.6rem] text-axiom-muted uppercase tracking-widest font-700 block mb-1">AXIOM Platform Specifications</span>
          <div>Software Engine: AXIOM MVP v1.0.4</div>
          <div>Telemetry Host Server: local_instance_db_42</div>
          <div>Security Compliance: HIPAA / GDPR encrypted standard</div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 bg-lime text-axiom-black font-condensed font-900 text-xs tracking-[2px] uppercase px-5 py-2.5 hover:bg-axiom-white transition-all disabled:opacity-60"
          >
            <Save size={13} />
            {saving ? 'Saving...' : 'Save Parameters'}
          </button>
          {saved && (
            <span className="text-xs text-lime font-condensed font-700 uppercase tracking-wider">
              System parameters saved successfully ✓
            </span>
          )}
        </div>
      </form>
    </PlatformLayout>
  );
}

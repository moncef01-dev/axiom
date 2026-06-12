import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, RefreshCw, Eye, Download, Printer, Share2 } from 'lucide-react';

import PlatformLayout from '../components/PlatformLayout';
import { useReportStore } from '../stores/useReportStore';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { reports, generateReport } = useReportStore();

  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [activeActionType, setActiveActionType] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAction = (id: string, actionType: string, callback?: () => void) => {
    setActiveActionId(id);
    setActiveActionType(actionType);
    
    // Simulate API loading state
    setTimeout(() => {
      setActiveActionId(null);
      setActiveActionType(null);
      if (callback) callback();
      else alert(`${actionType.toUpperCase()} action successfully completed for report: ${id}`);
    }, 1200);
  };

  const handleShare = (_id: string) => {
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <PlatformLayout
      title="Report Centre"
      subtitle="Generate, export, and manage clinical performance reports for athletes and squads"
    >
      {/* Search and Library Info */}
      <div className="bg-axiom-card border border-axiom-border p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-[0.65rem] tracking-[2px] uppercase text-axiom-muted font-condensed font-600">
          Sync Status: Ready · 6 Report Presets Available
        </span>
        <button className="flex items-center gap-1 bg-lime text-axiom-black font-condensed font-900 text-xs tracking-[2px] uppercase px-4 py-2 hover:bg-axiom-white transition-all">
          <Plus size={12} />
          Create Preset
        </button>
      </div>

      {/* Reports Library Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(report => {
          const isMatchReport = report.type === 'match_performance';
          const isGenerating = activeActionId === report.id && activeActionType === 'generate';
          const isDownloading = activeActionId === report.id && activeActionType === 'download';
          const isPrinting = activeActionId === report.id && activeActionType === 'print';

          return (
            <div
              key={report.id}
              className="bg-axiom-card border border-axiom-border p-5 flex flex-col justify-between hover:border-lime/20 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-condensed font-700 text-sm tracking-wider text-axiom-white uppercase">
                    {report.title}
                  </h3>
                  <span className="text-[0.6rem] text-axiom-muted font-condensed font-700 tracking-wider uppercase border border-axiom-border px-2 py-0.5">
                    {report.id.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-axiom-muted font-body mb-4 leading-relaxed">
                  {report.description}
                </p>
                <div className="flex items-center gap-1 text-[0.65rem] text-axiom-muted font-condensed font-600 uppercase mb-5">
                  <Calendar size={11} />
                  Last Generated: {report.lastGenerated || 'Never'}
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-axiom-border">
                {/* 1. Generate */}
                <button
                  disabled={isGenerating || isDownloading || isPrinting}
                  onClick={() => handleAction(report.id, 'generate', () => generateReport(report.id))}
                  className="report-action-btn primary"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-axiom-black/30 border-t-axiom-black rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={11} />
                      Generate
                    </>
                  )}
                </button>

                {/* 2. Preview */}
                {isMatchReport ? (
                  <button
                    onClick={() => navigate('/reports/match')}
                    className="report-action-btn"
                  >
                    <Eye size={11} />
                    Preview Showcase
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(report.id, 'preview')}
                    className="report-action-btn"
                  >
                    <Eye size={11} />
                    Preview
                  </button>
                )}

                {/* 3. Download */}
                <button
                  disabled={isGenerating || isDownloading || isPrinting}
                  onClick={() => handleAction(report.id, 'download')}
                  className="report-action-btn"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-axiom-white/30 border-t-axiom-white rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={11} />
                      PDF
                    </>
                  )}
                </button>

                {/* 4. Print */}
                <button
                  disabled={isGenerating || isDownloading || isPrinting}
                  onClick={() => handleAction(report.id, 'print', () => window.print())}
                  className="report-action-btn"
                >
                  <Printer size={11} />
                  Print
                </button>

                {/* 5. Share */}
                <button
                  onClick={() => handleShare(report.id)}
                  className="report-action-btn"
                >
                  <Share2 size={11} />
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Modal Dialog (Mock) */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-axiom-black/85 backdrop-filter backdrop-blur-sm">
          <div className="bg-axiom-card border border-axiom-border p-6 max-w-md w-full relative">
            <h3 className="font-condensed font-900 text-sm tracking-[2px] uppercase text-axiom-white mb-3">
              Share Performance Report
            </h3>
            <p className="text-xs text-axiom-muted font-body mb-5 leading-normal">
              Generate a secure, encrypted token link to share this report page with other coaching staff or medical professionals.
            </p>

            <div className="flex gap-2 items-center mb-6">
              <input
                type="text"
                readOnly
                value="https://axiom.performance.ai/reports/share?token=axm_8f921a2bb7f102"
                className="w-full bg-axiom-black border border-axiom-border px-3 py-2 text-[0.65rem] text-axiom-white outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="bg-lime text-axiom-black font-condensed font-900 text-xs tracking-wider uppercase px-4 py-2 hover:bg-axiom-white transition-all whitespace-nowrap"
              >
                {copiedLink ? 'Copied ✓' : 'Copy Link'}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-xs uppercase text-axiom-muted font-condensed font-600 hover:text-axiom-white px-3 py-2 border border-axiom-border"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </PlatformLayout>
  );
}

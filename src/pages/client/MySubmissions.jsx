import { useEffect, useState } from 'react';
import { clientApi } from '../../api';
import SubmissionCard from '../../components/SubmissionCard';
import { useAuth } from '../../context/AuthContext';
import { FileText, Download, ArrowUpDown } from 'lucide-react';
import { generateSubmissionsPDF } from '../../utils/pdfGenerator';
import { generateSubmissionsCSV } from '../../utils/csvGenerator';

export default function MySubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await clientApi.getMySubmissions();

      const dataArray = Array.isArray(data) ? data : (data.formSubmission ? [data.formSubmission] : []);
      setSubmissions(dataArray);
    } catch (err) {
      setError("Failed to load your submissions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (submissions.length === 0) {
      alert('No submissions to download');
      return;
    }

    const clientName = user?.userName || 'Client';
    const title = `My Submissions - ${clientName}`;
    const baseFilename = `my_submissions_${clientName.replace(/\s+/g, '_')}`;

    const enrichedSubmissions = sortedSubmissions.map(s => ({
      ...s,
      clientDetails: s.clientDetails || { userName: clientName }
    }));

    if (downloadFormat === 'csv') {
      generateSubmissionsCSV(enrichedSubmissions, `${baseFilename}.csv`);
    } else {
      generateSubmissionsPDF(enrichedSubmissions, title, `${baseFilename}.pdf`);
    }
  };

  const sortedSubmissions = [...submissions].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (loading) return <div className="text-center text-muted" style={{ padding: '3rem' }}>Loading...</div>;
  if (error) return <div className="card text-danger">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="font-semibold" style={{ fontSize: '1.125rem' }}>
          My Submissions ({submissions.length})
        </h2>

        <div className="flex gap-3">
          <div className="flex items-center gap-2" style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
            <ArrowUpDown size={14} className="text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="flex bg-tertiary rounded-sm p-1 gap-1 border border-border">
            <button
              onClick={() => setDownloadFormat('pdf')}
              className={`btn btn-sm ${downloadFormat === 'pdf' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '4px' }}
              title="Download as PDF"
            >
              PDF
            </button>
            <button
              onClick={() => setDownloadFormat('csv')}
              className={`btn btn-sm ${downloadFormat === 'csv' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: '4px' }}
              title="Download as Excel/CSV"
            >
              CSV
            </button>
            <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }}></div>
            <button
              onClick={handleDownload}
              className="btn btn-primary btn-sm"
              disabled={submissions.length === 0}
            >
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sortedSubmissions.map((submission, index) => (
          <SubmissionCard key={submission._id || index} submission={submission} />
        ))}

        {submissions.length === 0 && (
          <div className="card text-center text-muted" style={{ padding: '3rem' }}>
            <FileText size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <div className="font-semibold">No submissions yet</div>
            <div style={{ fontSize: '0.875rem' }}>You haven't received any form submissions yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}

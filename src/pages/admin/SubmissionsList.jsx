import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import SubmissionCard from '../../components/SubmissionCard';
import { Filter, ArrowUpDown, X, FileText, Download } from 'lucide-react';
import { generateSubmissionsPDF } from '../../utils/pdfGenerator';

export default function SubmissionsList() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [submissionsData, clientsData] = await Promise.all([
        clientId ? adminApi.getClientSubmissions(clientId) : adminApi.getAllSubmissions(),
        adminApi.getClients().catch(() => [])
      ]);

      if (Array.isArray(submissionsData)) {
        setSubmissions(submissionsData);
      } else if (submissionsData?.formSubmission) {
        setSubmissions([submissionsData.formSubmission]);
      } else {
        setSubmissions([]);
      }

      if (Array.isArray(clientsData)) setClients(clientsData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedSubmissions = useMemo(() => {
    let result = submissions.map(sub => {
      const client = clients.find(c => c.clientID === sub.clientID);
      return { ...sub, clientDetails: client || { userName: 'Unknown Client' } };
    });

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [submissions, clients, sortBy]);

  const handleClientChange = (e) => {
    const val = e.target.value;
    if (val === 'all') {
      navigate('/admin/submissions');
    } else {
      const client = clients.find(c => c._id === val);
      if (client) navigate(`/admin/submissions/client/${client.clientID}`);
    }
  };

  const handleDownloadPDF = () => {
    if (filteredAndSortedSubmissions.length === 0) {
      alert('No submissions to download');
      return;
    }

    const selectedClient = clientId ? clients.find(c => c.clientID === clientId) : null;
    const title = selectedClient
      ? `Submissions - ${selectedClient.userName}`
      : 'All Form Submissions';
    const filename = selectedClient
      ? `submissions_${selectedClient.userName.replace(/\s+/g, '_')}.pdf`
      : 'all_submissions.pdf';

    generateSubmissionsPDF(filteredAndSortedSubmissions, title, filename);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;

    try {
      await adminApi.deleteSubmission(id);
      setSubmissions(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert("Failed to delete submission");
    }
  };

  const currentClientDbId = clientId ? clients.find(c => c.clientID === clientId)?._id : 'all';

  if (loading) return <div className="text-center text-muted" style={{ padding: '3rem' }}>Loading...</div>;
  if (error) return <div className="card text-danger">{error}</div>;

  return (
    <div>
      <div className="card mb-6">
        <div className="flex gap-4" style={{ flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 250px' }}>
            <label className="form-label flex items-center gap-2">
              <Filter size={14} /> Filter by Client
            </label>
            <select
              className="input"
              value={currentClientDbId || 'all'}
              onChange={handleClientChange}
            >
              <option value="all">All Clients</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>{c.userName}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '0 0 180px' }}>
            <label className="form-label flex items-center gap-2">
              <ArrowUpDown size={14} /> Sort by Date
            </label>
            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div style={{ flex: '0 0 auto', display: 'flex', gap: '0.5rem' }}>
            {clientId && (
              <button onClick={() => navigate('/admin/submissions')} className="btn btn-secondary">
                <X size={16} /> Clear
              </button>
            )}
            <button
              onClick={handleDownloadPDF}
              className="btn btn-primary"
              disabled={filteredAndSortedSubmissions.length === 0}
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredAndSortedSubmissions.map((submission, index) => (
          <SubmissionCard
            key={submission._id || index}
            submission={submission}
            onDelete={handleDelete}
          />
        ))}

        {filteredAndSortedSubmissions.length === 0 && (
          <div className="card text-center text-muted" style={{ padding: '3rem' }}>
            <FileText size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <div className="font-semibold">No submissions found</div>
            <div style={{ fontSize: '0.875rem' }}>Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
}

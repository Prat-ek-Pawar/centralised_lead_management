import { memo } from 'react';
import { Clock, FileText, Hash, Trash2 } from 'lucide-react';

const SubmissionCard = memo(({ submission, onDelete }) => {
  const { data, createdAt, _id, clientDetails } = submission;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true
    });
  };

  const dataEntries = data && typeof data === 'object' ? Object.entries(data) : [];

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        padding: '0.875rem 1rem',
        background: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div className="flex items-center gap-2">
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: 'var(--accent-light)',
            color: 'var(--accent-text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FileText size={16} />
          </div>
          <div>
            {clientDetails && (
              <div className="font-semibold" style={{ fontSize: '0.875rem' }}>{clientDetails.userName}</div>
            )}
            <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.75rem' }}>
              <Hash size={10} />
              <span style={{ fontFamily: 'monospace' }}>{_id ? _id.slice(-8) : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
            <Clock size={14} />
            {formatDate(createdAt)}
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(_id)}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.25rem 0.5rem', height: 'auto' }}
              title="Delete Submission"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '1rem' }}>
        {dataEntries.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {dataEntries.map(([key, value]) => (
              <div key={key}>
                <div className="form-label" style={{ marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                  {key}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  wordBreak: 'break-word',
                  color: 'var(--text-primary)'
                }}>
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted">No data fields available.</div>
        )}
      </div>
    </div>
  );
});

export default SubmissionCard;

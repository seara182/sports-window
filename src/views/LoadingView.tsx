// Shown only on a true cold start (no cache yet). A warm start renders cached
// data instantly and never sees this.
import { useTranslation } from 'react-i18next';

export function LoadingView() {
  const { t } = useTranslation();
  return (
    <div className="view-enter" aria-busy="true" aria-label={t('common.loading')}>
      <div className="skeleton" style={{ height: 196, borderRadius: 20 }} />
      <div className="section">
        <div className="skeleton" style={{ height: 22, width: 180, marginBottom: 16 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 104, borderRadius: 14 }} />
          ))}
        </div>
      </div>
      <div className="section">
        <div className="skeleton" style={{ height: 22, width: 220, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 230, borderRadius: 20 }} />
      </div>
    </div>
  );
}

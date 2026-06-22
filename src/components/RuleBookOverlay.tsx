// Standalone "Rule Book" reference modal — a searchable explainer for NFL
// and MLB basics plus a newcomer-friendly "How to Watch" overview. Opened
// from the topbar book icon. Not built on the DetailOverlay/card-flip
// system (that's sized and animated for small card popups with an origin
// rect); this is a larger, centered dialog with its own scale+fade animation.
import { useEffect, useMemo, useRef, useState, type AnimationEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { CloseIcon, SearchIcon, BookIcon } from './Icons';
import { useSettings } from '../state/SettingsProvider';
import { getRuleBook, searchRuleBook, type RuleBookEntry } from '../data/ruleBook';
import './RuleBookOverlay.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/** Wraps occurrences of `query` in <mark> for lightweight search highlighting. */
function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: ReactNode[] = [];
  let i = 0;
  let idx = lower.indexOf(q);
  if (idx === -1) return text;
  while (idx !== -1) {
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(
      <mark className="rulebook__hl" key={idx}>
        {text.slice(idx, idx + q.length)}
      </mark>,
    );
    i = idx + q.length;
    idx = lower.indexOf(q, i);
  }
  if (i < text.length) parts.push(text.slice(i));
  return parts;
}

function EntryBody({ entry, query }: { entry: RuleBookEntry; query: string }) {
  return (
    <article className="rulebook__entry" id={`rulebook-entry-${entry.id}`}>
      <h3 className="rulebook__entry-title">{highlight(entry.title, query)}</h3>
      {entry.body.map((block, i) =>
        typeof block === 'string' ? (
          <p key={i} className="rulebook__p">
            {highlight(block, query)}
          </p>
        ) : (
          <ul key={i} className="rulebook__list">
            {block.bullets.map((b, j) => (
              <li key={j}>{highlight(b, query)}</li>
            ))}
          </ul>
        ),
      )}
    </article>
  );
}

export function RuleBookOverlay({ isOpen, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const book = useMemo(() => getRuleBook(i18n.language), [i18n.language]);
  const { settings } = useSettings();
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState(book[0].id);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setClosing(false);
    } else if (rendered) {
      setClosing(true);
    }
  }, [isOpen, rendered]);

  useEffect(() => {
    if (isOpen && rendered) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen, rendered]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveSection(book[0].id);
    }
  }, [isOpen, book]);

  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rendered, onClose]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    if (rendered) root.setAttribute('aria-hidden', 'true');
    else root.removeAttribute('aria-hidden');
    return () => root.removeAttribute('aria-hidden');
  }, [rendered]);

  const q = query.trim();
  const hits = useMemo(() => searchRuleBook(q, i18n.language), [q, i18n.language]);
  const hitsBySection = useMemo(() => {
    const map = new Map<string, typeof hits>();
    for (const hit of hits) {
      const arr = map.get(hit.sectionId);
      if (arr) arr.push(hit);
      else map.set(hit.sectionId, [hit]);
    }
    return map;
  }, [hits]);

  if (!rendered) return null;

  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (!closing) return;
    if (e.animationName === 'rulebook-out') {
      setRendered(false);
      setClosing(false);
    }
  };

  const panelClass = `rulebook__panel${closing ? ' is-closing' : ' is-opening'}`;
  const isSearching = q.length > 0;

  return createPortal(
    <div className="rulebook" data-font-size={settings.fontSize}>
      <div className={`rulebook__backdrop${closing ? ' is-closing' : ''}`} onClick={onClose} />
      <div className="rulebook__wrap">
        <div
          className={panelClass}
          role="dialog"
          aria-modal="true"
          aria-label={t('ruleBook.title')}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="rulebook__header">
            <div className="rulebook__title">
              <BookIcon size={20} />
              <span>{t('ruleBook.title')}</span>
            </div>
            <div className="rulebook__search">
              <SearchIcon size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('ruleBook.search')}
                aria-label={t('ruleBook.searchAria')}
              />
            </div>
            <button
              ref={closeBtnRef}
              className="rulebook__close"
              onClick={onClose}
              aria-label={t('ruleBook.close')}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="rulebook__body">
            {/* Mobile section picker: a horizontal scroll row of section tabs is
                undiscoverable on a phone, so on mobile this dropdown replaces the
                sidebar nav below (which is hidden via CSS at the same breakpoint). */}
            <div className="rulebook__section-select">
              <select
                aria-label={t('ruleBook.chooseSection')}
                value={activeSection}
                onChange={(e) => {
                  setQuery('');
                  setActiveSection(e.target.value);
                }}
              >
                {book.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            <nav className="rulebook__sidebar">
              {book.map((section) => {
                const count = hitsBySection.get(section.id)?.length;
                const active = !isSearching && activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    className={`rulebook__nav-btn${active ? ' is-active' : ''}`}
                    onClick={() => {
                      setQuery('');
                      setActiveSection(section.id);
                    }}
                  >
                    <span>{section.label}</span>
                    {isSearching && <span className="rulebook__nav-count">{count ?? 0}</span>}
                  </button>
                );
              })}
            </nav>

            <div className="rulebook__content">
              {isSearching ? (
                hits.length === 0 ? (
                  <div className="rulebook__empty">{t('ruleBook.noResults', { query })}</div>
                ) : (
                  book.map((section) => {
                    const sectionHits = hitsBySection.get(section.id);
                    if (!sectionHits) return null;
                    return (
                      <div key={section.id} className="rulebook__group">
                        <div className="rulebook__group-label">{section.label}</div>
                        {sectionHits.map((hit) => (
                          <EntryBody key={hit.entry.id} entry={hit.entry} query={q} />
                        ))}
                      </div>
                    );
                  })
                )
              ) : (
                book
                  .find((s) => s.id === activeSection)
                  ?.entries.map((entry) => <EntryBody key={entry.id} entry={entry} query="" />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

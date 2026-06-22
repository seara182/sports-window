import { useEffect, useState } from 'react';
import type { SportKey } from '../types/domain';
import { fetchHeadToHead, type HeadToHeadData } from '../data/headToHead';

export type HeadToHeadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: HeadToHeadData };

export function useHeadToHead(
  sport: SportKey,
  slug: string,
  teamAbbr: string,
  opponentId: string | undefined,
): HeadToHeadState {
  const [state, setState] = useState<HeadToHeadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    fetchHeadToHead(sport, slug, teamAbbr, opponentId)
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [sport, slug, teamAbbr, opponentId]);

  return state;
}

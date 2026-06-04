import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';
import { SquadType, SquadAssignments } from '../data/squads';

const STORAGE_KEY = 'droidex_v1';

interface StoredState {
  collected: string[];
  rebirthLevel: number;
  squads?: SquadAssignments;
}

const DEFAULT_SQUADS: SquadAssignments = {
  COMPANION: [null],
  LOUNGE: [null, null, null, null, null],
  WORKER: [null, null, null, null, null, null, null, null, null, null, null],
  ASTROMECH: [null, null, null, null, null, null, null, null, null],
  BATTLE: [null, null, null, null, null],
};

function readLocalStorage(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredState;
  } catch {
    // ignore
  }
  return null;
}

function writeLocalStorage(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeSquads(squads: any): SquadAssignments {
  if (!squads) return DEFAULT_SQUADS;
  const result = { ...DEFAULT_SQUADS };
  for (const key of Object.keys(DEFAULT_SQUADS) as SquadType[]) {
    if (Array.isArray(squads[key])) {
      result[key] = result[key].map((_: string | null, idx: number) => {
        const val = squads[key][idx];
        return typeof val === 'string' ? val : null;
      });
    }
  }
  return result;
}

export function useTracker(uid: string | null) {
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [rebirthLevel, setRebirthLevelState] = useState<number>(0);
  const [squads, setSquadsState] = useState<SquadAssignments>(DEFAULT_SQUADS);

  const rebirthLevelRef = useRef(rebirthLevel);
  useEffect(() => {
    rebirthLevelRef.current = rebirthLevel;
  }, [rebirthLevel]);

  const squadsRef = useRef(squads);
  useEffect(() => {
    squadsRef.current = squads;
  }, [squads]);

  useEffect(() => {
    if (!uid) {
      // Guest mode: load from localStorage
      const local = readLocalStorage();
      setCollected(new Set(local?.collected ?? []));
      setRebirthLevelState(local?.rebirthLevel ?? 0);
      setSquadsState(normalizeSquads(local?.squads));
      return;
    }

    const userRef = doc(db, 'users', uid);

    // Migrate guest localStorage data to Firestore on sign-in
    const local = readLocalStorage();
    if (local && (local.collected.length > 0 || local.rebirthLevel > 0 || local.squads)) {
      setDoc(
        userRef,
        {
          collected: local.collected,
          rebirthLevel: local.rebirthLevel,
          squads: normalizeSquads(local.squads),
        },
        { merge: true },
      ).then(() => localStorage.removeItem(STORAGE_KEY));
    }

    const unsubscribe: Unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as StoredState;
        setCollected(new Set(data.collected ?? []));
        setRebirthLevelState(data.rebirthLevel ?? 0);
        setSquadsState(normalizeSquads(data.squads));
      } else {
        setCollected(new Set());
        setRebirthLevelState(0);
        setSquadsState(DEFAULT_SQUADS);
      }
    });

    return unsubscribe;
  }, [uid]);

  const toggle = useCallback(
    (id: string) => {
      setCollected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        if (uid) {
          setDoc(
            doc(db, 'users', uid),
            {
              collected: Array.from(next),
              rebirthLevel: rebirthLevelRef.current,
            },
            { merge: true },
          );
        } else {
          writeLocalStorage({
            collected: Array.from(next),
            rebirthLevel: rebirthLevelRef.current,
            squads: squadsRef.current,
          });
        }
        return next;
      });
    },
    [uid],
  );

  const setRebirthLevel = useCallback(
    (level: number) => {
      setRebirthLevelState(level);
      setCollected((prev) => {
        if (uid) {
          setDoc(
            doc(db, 'users', uid),
            {
              collected: Array.from(prev),
              rebirthLevel: level,
            },
            { merge: true },
          );
        } else {
          writeLocalStorage({
            collected: Array.from(prev),
            rebirthLevel: level,
            squads: squadsRef.current,
          });
        }
        return prev;
      });
    },
    [uid],
  );

  const assignToSquad = useCallback(
    (squadType: SquadType, slotIndex: number, cardId: string | null) => {
      setSquadsState((prev: SquadAssignments) => {
        const next = {
          ...prev,
          [squadType]: prev[squadType].map((val: string | null, idx: number) => (idx === slotIndex ? cardId : val)),
        };
        if (uid) {
          setDoc(
            doc(db, 'users', uid),
            {
              squads: next,
            },
            { merge: true },
          );
        } else {
          writeLocalStorage({
            collected: Array.from(collected),
            rebirthLevel: rebirthLevelRef.current,
            squads: next,
          });
        }
        return next;
      });
    },
    [uid, collected],
  );

  const clearSquad = useCallback(
    (squadType: SquadType) => {
      setSquadsState((prev: SquadAssignments) => {
        const next = {
          ...prev,
          [squadType]: prev[squadType].map(() => null),
        };
        if (uid) {
          setDoc(
            doc(db, 'users', uid),
            {
              squads: next,
            },
            { merge: true },
          );
        } else {
          writeLocalStorage({
            collected: Array.from(collected),
            rebirthLevel: rebirthLevelRef.current,
            squads: next,
          });
        }
        return next;
      });
    },
    [uid, collected],
  );

  return {
    collected,
    toggle,
    rebirthLevel,
    setRebirthLevel,
    squads,
    assignToSquad,
    clearSquad,
  };
}

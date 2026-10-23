"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { AnalyzeItemResult, ImpactStats, UserAction } from "@/lib/types";
import { DEMO_IMPACT_STATS, DEMO_RECENT_ACTIONS } from "@/lib/mockData";

interface ImpactContextValue {
  stats: ImpactStats;
  actions: UserAction[];
  isDemo: boolean;
  loading: boolean;
  recordAction: (result: AnalyzeItemResult, estimatedKgCO2e?: number) => Promise<void>;
}

const ImpactContext = createContext<ImpactContextValue>({
  stats: DEMO_IMPACT_STATS,
  actions: DEMO_RECENT_ACTIONS,
  isDemo: true,
  loading: false,
  recordAction: async () => {},
});

export function ImpactProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isDemo = !isFirebaseConfigured || !user;

  const [stats, setStats] = useState<ImpactStats>(DEMO_IMPACT_STATS);
  const [actions, setActions] = useState<UserAction[]>(DEMO_RECENT_ACTIONS);
  const [loading, setLoading] = useState(false);

  // Reset to fresh local demo state whenever we drop back to demo mode
  useEffect(() => {
    if (isDemo) {
      setStats(DEMO_IMPACT_STATS);
      setActions(DEMO_RECENT_ACTIONS);
    }
  }, [isDemo]);

  // Subscribe to the signed-in user's Firestore data
  useEffect(() => {
    if (isDemo || !db || !user) return;

    setLoading(true);
    const userRef = doc(db, "users", user.uid);

    (async () => {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName ?? "3R AI user",
          email: user.email ?? "",
          createdAt: serverTimestamp(),
          totalActions: 0,
          reusedCount: 0,
          recycledCount: 0,
          reducedCount: 0,
          challengeDay: 1,
        });
      }
    })();

    const unsubUser = onSnapshot(userRef, (snap) => {
      const data = snap.data();
      if (data) {
        setStats({
          totalActions: data.totalActions ?? 0,
          reusedCount: data.reusedCount ?? 0,
          recycledCount: data.recycledCount ?? 0,
          reducedCount: data.reducedCount ?? 0,
          challengeDay: data.challengeDay ?? 1,
          estimatedKgCO2e: data.estimatedKgCO2e ?? 0,
        });
      }
      setLoading(false);
    });

    const actionsRef = query(
      collection(db, "users", user.uid, "actions"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubActions = onSnapshot(actionsRef, (snap) => {
      setActions(
        snap.docs.map((d) => {
          const data = d.data();
          const createdAt =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : new Date().toISOString();
          return {
            id: d.id,
            itemName: data.itemName,
            category: data.category,
            action: data.action,
            explanation: data.explanation,
            createdAt,
            estimatedKgCO2e: data.estimatedKgCO2e,
          } as UserAction;
        })
      );
    });

    return () => {
      unsubUser();
      unsubActions();
    };
  }, [isDemo, user]);

  const recordAction = useCallback(
    async (result: AnalyzeItemResult, estimatedKgCO2e?: number) => {
      const newAction: UserAction = {
        id: `local-${Date.now()}`,
        itemName: result.itemName,
        category: result.category,
        action: result.bestAction,
        explanation: result.explanation,
        createdAt: new Date().toISOString(),
        estimatedKgCO2e,
      };

      if (isDemo || !db || !user) {
        // Demo mode: keep everything in local component state only.
        setActions((prev) => [newAction, ...prev].slice(0, 10));
        setStats((prev) => ({
          totalActions: prev.totalActions + 1,
          reusedCount: prev.reusedCount + (result.bestAction === "reuse" ? 1 : 0),
          recycledCount:
            prev.recycledCount + (result.bestAction === "recycle" ? 1 : 0),
          reducedCount: prev.reducedCount + (result.bestAction === "reduce" ? 1 : 0),
          challengeDay: Math.min(prev.challengeDay + 1, 7),
          estimatedKgCO2e: (prev.estimatedKgCO2e ?? 0) + (estimatedKgCO2e ?? 0),
        }));
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const fieldMap: Record<string, string> = {
        reduce: "reducedCount",
        reuse: "reusedCount",
        recycle: "recycledCount",
      };

      await addDoc(collection(db, "users", user.uid, "actions"), {
        itemName: result.itemName,
        category: result.category,
        action: result.bestAction,
        explanation: result.explanation,
        createdAt: serverTimestamp(),
        ...(estimatedKgCO2e !== undefined ? { estimatedKgCO2e } : {}),
      });

      await updateDoc(userRef, {
        totalActions: increment(1),
        [fieldMap[result.bestAction]]: increment(1),
        ...(estimatedKgCO2e !== undefined ? { estimatedKgCO2e: increment(estimatedKgCO2e) } : {}),
      });
    },
    [isDemo, user]
  );

  return (
    <ImpactContext.Provider value={{ stats, actions, isDemo, loading, recordAction }}>
      {children}
    </ImpactContext.Provider>
  );
}

export function useImpact() {
  return useContext(ImpactContext);
}

import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { BinChoice, scoreQuiz } from "./quiz";

/** Random anonymous id kept in this browser only, so a retake can be paired with the first attempt. */
function participantId(): string {
  try {
    let id = localStorage.getItem("3r-pid");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("3r-pid", id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

export function attemptNumber(): number {
  try {
    return parseInt(localStorage.getItem("3r-attempts") ?? "0", 10) + 1;
  } catch {
    return 1;
  }
}

/** Anonymous: stores answers, score, a random browser id and attempt number. No identity. */
export async function submitQuiz(answers: Record<string, BinChoice>): Promise<boolean> {
  const attempt = attemptNumber();
  try { localStorage.setItem("3r-attempts", String(attempt)); localStorage.setItem("3r-last-quiz", JSON.stringify({ answers, score: scoreQuiz(answers), attempt })); } catch {}
  if (!isFirebaseConfigured || !db) return false;
  try {
    await addDoc(collection(db, "quizResponses"), {
      answers,
      score: scoreQuiz(answers),
      pid: participantId(),
      attempt,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch {
    return false;
  }
}

export async function fetchQuizResponses(): Promise<{ answers: Record<string, BinChoice>; pid?: string; attempt?: number }[] | null> {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const snap = await getDocs(query(collection(db, "quizResponses"), orderBy("createdAt", "desc"), limit(500)));
    return snap.docs.map((d) => ({ answers: (d.data().answers ?? {}) as Record<string, BinChoice>, pid: d.data().pid, attempt: d.data().attempt }));
  } catch {
    return null;
  }
}

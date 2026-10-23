import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { LearningReceipt } from "./types";

/**
 * Persists a Learning Receipt to the existing Firestore architecture
 * (users/{uid}/receipts/{id}), reusing the same database already used
 * for impact stats and action history — no new persistence layer.
 * No-ops (returns false) when Firestore isn't configured or no user
 * is signed in, so demo mode never silently fails.
 */
export async function saveReceipt(uid: string | null, receipt: LearningReceipt): Promise<boolean> {
  if (!uid || !db) return false;
  try {
    await addDoc(collection(db, "users", uid, "receipts"), {
      ...receipt,
      savedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("saveReceipt failed:", err);
    return false;
  }
}

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { LearningReceipt } from "./types";

export type SaveStatus = "none" | "cloud" | "local" | "failed";
const KEY = "3r-receipts-v1";

function saveLocal(receipt: LearningReceipt): boolean {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    list.unshift({ ...receipt, savedAt: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
    return true;
  } catch {
    return false;
  }
}

/**
 * Always saves on this device first (works signed out), then also tries
 * the cloud (users/{uid}/receipts) when signed in. Never silently fails.
 */
export async function saveReceipt(uid: string | null, receipt: LearningReceipt): Promise<SaveStatus> {
  const local = saveLocal(receipt);
  if (uid && db) {
    try {
      await addDoc(collection(db, "users", uid, "receipts"), { ...receipt, savedAt: serverTimestamp() });
      return "cloud";
    } catch (err) {
      console.error("saveReceipt cloud failed:", err);
    }
  }
  return local ? "local" : "failed";
}

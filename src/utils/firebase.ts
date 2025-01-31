import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  where as w,
  type WhereFilterOp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);
export const chatCollection = collection(firestore, "chats");

/** Field specifier to ensure the keys when using query. */
export function where<T extends string>(
  field: T,
  as: WhereFilterOp,
  value: string
) {
  return w(field, as, value);
}

export default firebase;

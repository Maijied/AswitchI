import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNPHWuLozMLFfd_J15b6byCdaINd_g4PQ",
  authDomain: "cursor-curse-by-lorapok.firebaseapp.com",
  projectId: "cursor-curse-by-lorapok",
  storageBucket: "cursor-curse-by-lorapok.firebasestorage.app",
  messagingSenderId: "437750136123",
  appId: "1:437750136123:web:763af6cfc198cc5ef38b1e"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

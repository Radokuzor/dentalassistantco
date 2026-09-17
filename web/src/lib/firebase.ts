import { getApp, getApps, initializeApp } from "firebase/app";

// Firebase web config is public by design; access is enforced by security rules.
export const firebaseConfig = {
  apiKey: "AIzaSyCfTXLiVzqgHIxI9pOgmPCfgjSucs9mGQQ",
  authDomain: "take-shots-f1a99.firebaseapp.com",
  projectId: "take-shots-f1a99",
  storageBucket: "take-shots-f1a99.firebasestorage.app",
  messagingSenderId: "349353111843",
  appId: "1:349353111843:web:573d211d87e78fd7dc1c96",
  measurementId: "G-KW4Q59VD58",
};

export const firebaseApp = () => (getApps().length ? getApp() : initializeApp(firebaseConfig));

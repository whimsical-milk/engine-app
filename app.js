import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* 🔥 Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyAeh-4-DhdMgEyQ8uv6A2ChQDdm-ID2K0E",
  authDomain: "web-app-7f9c9.firebaseapp.com",
  projectId: "web-app-7f9c9",
};

/* Initialize Firebase */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* Ensure login persists across reloads */
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence set"))
  .catch(console.error);

/* Wait for DOM to load before attaching events */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupBtn").addEventListener("click", signup);
  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("forgotBtn").addEventListener("click", forgot);
});

/* SIGN UP FUNCTION */
async function signup() {
  const username = document.getElementById("su-username").value.trim();
  const email = document.getElementById("su-email").value.trim();
  const password = document.getElementById("su-password").value;

  if (!username || !email || !password) {
    alert("All fields are required");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Save user info in Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      username,
      email,
      created: Date.now()
    });

    // Redirect to marketplace immediately
    location.href = "marketplace.html";

  } catch (e) {
    alert(e.message);
  }
}

/* LOGIN FUNCTION */
async function login() {
  const email = document.getElementById("li-email").value.trim();
  const password = document.getElementById("li-password").value;

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Redirect to marketplace immediately
    location.href = "marketplace.html";

  } catch (e) {
    alert(e.message);
  }
}

/* FORGOT PASSWORD FUNCTION */
async function forgot() {
  const email = document.getElementById("li-email").value.trim();
  if (!email) {
    alert("Enter your email first");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
  } catch (e) {
    alert(e.message);
  }
}

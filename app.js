import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyAeh-4-DhdMgEyQ8uv6A2ChQDdm-ID2K0E",
  authDomain: "web-app-7f9c9.firebaseapp.com",
  projectId: "web-app-7f9c9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* DOM elements */
const authBox = document.getElementById("authBox");
const profileBox = document.getElementById("profileBox");
const userInfo = document.getElementById("userInfo");
const marketplaceBtn = document.getElementById("marketplaceBtn");

/* Ensure persistence */
setPersistence(auth, browserLocalPersistence).catch(console.error);

/* Event listeners */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupBtn").addEventListener("click", signup);
  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("forgotBtn").addEventListener("click", forgot);
  marketplaceBtn.addEventListener("click", () => location.href = "marketplace.html");
});

/* Display profile after login/signup */
async function displayProfile(user) {
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data();
    if (data && data.username) {
      userInfo.innerText = `Logged in as ${data.username}`;
      authBox.style.display = "none";
      profileBox.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    authBox.style.display = "block";
    profileBox.style.display = "none";
  }
}

/* Signup */
async function signup() {
  const username = document.getElementById("su-username").value.trim();
  const email = document.getElementById("su-email").value.trim();
  const password = document.getElementById("su-password").value;

  if (!username || !email || !password) { alert("All fields required"); return; }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), { username, email, created: Date.now() });
    displayProfile(cred.user);
  } catch (e) { alert(e.message); }
}

/* Login */
async function login() {
  const email = document.getElementById("li-email").value.trim();
  const password = document.getElementById("li-password").value;

  if (!email || !password) { alert("Email and password required"); return; }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    displayProfile(userCredential.user);
  } catch (e) { alert(e.message); }
}

/* Forgot password */
async function forgot() {
  const email = document.getElementById("li-email").value.trim();
  if (!email) { alert("Enter email first"); return; }

  try { await sendPasswordResetEmail(auth, email); alert("Password reset email sent!"); }
  catch (e) { alert(e.message); }
}

/* Check auth state on page load */
onAuthStateChanged(auth, user => {
  if (user) displayProfile(user);
  else { authBox.style.display = "block"; profileBox.style.display = "none"; }
});

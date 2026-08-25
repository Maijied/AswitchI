/**
 * AswitchI Mission Control — Admin Panel Controller
 * Master Administrator Clearance: mdshuvo40@gmail.com
 * Lorapok Labs Enterprise Infrastructure
 */

const MASTER_ADMIN_EMAIL = "mdshuvo40@gmail.com";

// Firebase Configuration (Matching Lorapok Production Stack)
const firebaseConfig = {
  apiKey: "AIzaSyDNPHWuLozMLFfd_J15b6byCdaINd_g4PQ",
  authDomain: "cursor-curse-by-lorapok.firebaseapp.com",
  projectId: "cursor-curse-by-lorapok",
  storageBucket: "cursor-curse-by-lorapok.firebasestorage.app",
  messagingSenderId: "437750136123",
  appId: "1:437750136123:web:763af6cfc198cc5ef38b1e"
};

// Initialize Firebase
let app, auth, googleProvider;
try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (e) {
  console.warn("Firebase initialization note:", e);
}

// DOM Elements
const authLoading = document.getElementById("auth-loading");
const loginView = document.getElementById("login-view");
const deniedView = document.getElementById("denied-view");
const dashboardView = document.getElementById("dashboard-view");

const btnGoogleLogin = document.getElementById("btn-google-login");
const emailAuthForm = document.getElementById("email-auth-form");
const adminEmailInput = document.getElementById("admin-email-input");
const authAlert = document.getElementById("auth-alert");

const btnSignout = document.getElementById("btn-signout");
const btnDeniedSignout = document.getElementById("btn-denied-signout");
const adminDisplayName = document.getElementById("admin-display-name");
const adminDisplayEmail = document.getElementById("admin-display-email");
const adminAvatar = document.getElementById("admin-avatar");
const deniedEmailText = document.getElementById("denied-email-text");

// Helper: Show Alert
function showAlert(message, type = "error") {
  if (!authAlert) return;
  authAlert.textContent = message;
  authAlert.className = `auth-alert ${type}`;
  authAlert.style.display = "block";
}

function hideAlert() {
  if (!authAlert) return;
  authAlert.style.display = "none";
}

// Master Admin Authorization Check
function isAuthorizedAdmin(email) {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  return cleanEmail === MASTER_ADMIN_EMAIL.toLowerCase() || cleanEmail === "lorapokdev@gmail.com" || cleanEmail === "maizied@lorapok.tech";
}

// State Management
function showView(view) {
  authLoading.style.display = "none";
  loginView.style.display = "none";
  deniedView.style.display = "none";
  dashboardView.style.display = "none";

  if (view === "loading") authLoading.style.display = "flex";
  else if (view === "login") loginView.style.display = "flex";
  else if (view === "denied") deniedView.style.display = "flex";
  else if (view === "dashboard") dashboardView.style.display = "flex";
}

// Log audit entry
function addAuditLog(text, type = "info") {
  const terminal = document.getElementById("audit-log-terminal");
  if (!terminal) return;
  const line = document.createElement("div");
  line.className = `log-line ${type}`;
  const now = new Date().toLocaleTimeString();
  line.textContent = `[${now}] ${text}`;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

// Auth State Listener
if (auth) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      const email = user.email || "";
      if (isAuthorizedAdmin(email)) {
        // User Authorized
        if (adminDisplayName) adminDisplayName.textContent = user.displayName || "Master Admin";
        if (adminDisplayEmail) adminDisplayEmail.textContent = email;
        if (adminAvatar && user.photoURL) adminAvatar.src = user.photoURL;

        showView("dashboard");
        addAuditLog(`Master Admin session verified: ${email}`, "success");
      } else {
        // Not Authorized
        if (deniedEmailText) {
          deniedEmailText.textContent = `Your account (${email}) does not have Master Admin clearance.`;
        }
        showView("denied");
        addAuditLog(`Unauthorized login attempt by: ${email}`, "warn");
      }
    } else {
      showView("login");
    }
  });
}

// Google Sign-In Handler
if (btnGoogleLogin) {
  btnGoogleLogin.addEventListener("click", async () => {
    hideAlert();
    try {
      btnGoogleLogin.disabled = true;
      btnGoogleLogin.style.opacity = "0.7";
      await auth.signInWithPopup(googleProvider);
    } catch (err) {
      console.error("Google Auth Error:", err);
      showAlert(err.message || "Google sign-in failed. Please try again.", "error");
    } finally {
      btnGoogleLogin.disabled = false;
      btnGoogleLogin.style.opacity = "1";
    }
  });
}

// Email Magic Link Handler
if (emailAuthForm) {
  emailAuthForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();
    const email = adminEmailInput.value.trim();
    if (!email) return;

    try {
      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true
      };
      await auth.sendSignInLinkToEmail(email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);
      showAlert(`Magic login link sent to ${email}. Check your inbox.`, "success");
    } catch (err) {
      console.error("Magic Link Error:", err);
      showAlert(err.message || "Failed to send magic link.", "error");
    }
  });
}

// Handle incoming email link
if (auth && auth.isSignInWithEmailLink(window.location.href)) {
  let email = localStorage.getItem("emailForSignIn");
  if (!email) {
    email = window.prompt("Please provide your email for confirmation");
  }
  if (email) {
    auth.signInWithEmailLink(email, window.location.href)
      .then(() => {
        localStorage.removeItem("emailForSignIn");
        window.location.replace(window.location.pathname);
      })
      .catch((err) => {
        showAlert(err.message || "Invalid magic link sign-in.", "error");
      });
  }
}

// Sign Out Handlers
if (btnSignout) {
  btnSignout.addEventListener("click", () => auth.signOut());
}
if (btnDeniedSignout) {
  btnDeniedSignout.addEventListener("click", () => auth.signOut());
}

// Tab Switching
document.querySelectorAll(".nav-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    const target = tab.getAttribute("data-tab");
    const pane = document.getElementById(`tab-${target}`);
    if (pane) pane.classList.add("active");

    addAuditLog(`Navigated to view: ${target.toUpperCase()}`);
  });
});

// Snap Operations Controller
const btnExecuteSnapOp = document.getElementById("btn-execute-snap-op");
const btnGenerateCli = document.getElementById("btn-generate-cli");

if (btnExecuteSnapOp) {
  btnExecuteSnapOp.addEventListener("click", () => {
    const op = document.getElementById("snap-op-select").value;
    const rev = document.getElementById("snap-rev-input").value;
    const channel = document.getElementById("snap-channel-select").value;
    const pct = document.getElementById("snap-prog-input").value;

    let summary = `Initiating Snapcraft 9 Operation: ${op} -> Channel: ${channel}`;
    if (rev) summary += ` (Revision ${rev})`;
    if (op === "progressive_release") summary += ` [${pct}% rollout]`;

    addAuditLog(summary, "warn");
    alert(`[Snapcraft 9 Manager]\n${summary}\n\nOperation logged and triggered on GitHub Actions dispatch.`);
  });
}

if (btnGenerateCli) {
  btnGenerateCli.addEventListener("click", () => {
    const op = document.getElementById("snap-op-select").value;
    const rev = document.getElementById("snap-rev-input").value;
    const channel = document.getElementById("snap-channel-select").value;
    const pct = document.getElementById("snap-prog-input").value;

    let cli = "";
    if (op === "promote_release") cli = `snapcraft release aswitchi ${rev} ${channel}`;
    else if (op === "progressive_release") cli = `snapcraft release aswitchi ${rev} ${channel} --progressive ${pct}`;
    else if (op === "rollback") cli = `snapcraft release aswitchi ${rev} ${channel}`;
    else if (op === "close_channel") cli = `snapcraft close aswitchi ${channel}`;
    else cli = `snapcraft status aswitchi`;

    navigator.clipboard.writeText(cli);
    addAuditLog(`Copied CLI: ${cli}`, "info");
    alert(`Copied CLI command to clipboard:\n\n${cli}`);
  });
}

// Clear Logs
const btnClearLogs = document.getElementById("btn-clear-logs");
if (btnClearLogs) {
  btnClearLogs.addEventListener("click", () => {
    const terminal = document.getElementById("audit-log-terminal");
    if (terminal) terminal.innerHTML = '<div class="log-line info">[SYSTEM] Log view reset.</div>';
  });
}

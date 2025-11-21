
// Minimal working Firebase admin commands
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getDatabase, ref, set, update, remove, push } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNDsHNRkJSvTBL2CqgIMo8PUHk-FCGKmo",
  authDomain: "chatpack-1c0db.firebaseapp.com",
  databaseURL: "https://chatpack-1c0db-default-rtdb.firebaseio.com",
  projectId: "chatpack-1c0db",
  storageBucket: "chatpack-1c0db.firebasestorage.app",
  messagingSenderId: "579488821692",
  appId: "1:579488821692:web:5e4e52326d5e92603abbb9",
  measurementId: "G-8LL9SVXL8K"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function writeCommand(cmd, payload={}) {
  const id = Date.now().toString();
  return set(ref(db, 'admin_commands/' + id), {
    command: cmd,
    payload: payload,
    timestamp: Date.now()
  });
}

// Attach handlers
window.runAdmin = function(cmd){
  const val = prompt("Target user email (if needed):") || "";
  writeCommand(cmd, {target: val});
  alert(cmd + " sent!");
};

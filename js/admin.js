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
firebase.initializeApp(firebaseConfig);

// admin.js - advanced moderator tools
var db = firebase.database();
firebase.auth().onAuthStateChanged(function(user){
  if(!user) return window.location.href='index.html';
  var email = (user.email||'').trim().toLowerCase();
  var admin = (localStorage.getItem('ADMIN_EMAIL')||'proadmin@proton.me').trim().toLowerCase();
  if(email !== admin) { document.body.innerHTML = '<h2 style="color:#ff6b6b">Access denied. Not admin.</h2>'; return; }
  document.getElementById('status').textContent = 'Welcome Admin: '+user.email;
  if(window.renderAdminTools) renderAdminTools();
});

function renderAdminTools(){
  var container = document.createElement('div');
  container.innerHTML = '\
    <h3>Moderation</h3>\
    <div><input id="targetE" placeholder="email"><button onclick="banUser()">Ban</button><button onclick="unbanUser()">Unban</button></div>\
    <div><input id="muteE" placeholder="email"><button onclick="muteUser()">Mute</button><button onclick="unmuteUser()">Unmute</button></div>\
    <div><button onclick="muteAll()">Mute All</button><button onclick="unmuteAll()">Unmute All</button></div>\
    <div><input id="delMsg" placeholder="messageKey"><button onclick="deleteMessage()">Delete Message by Key</button></div>\
    <div><input id="forceUid" placeholder="user uid"><button onclick="forceLogout()">Force Logout</button></div>\
    <div><input id="shadowE" placeholder="email"><button onclick="toggleShadowMute()">Toggle Shadow Mute</button></div>\
    <div><button onclick="viewLogs()">View Logs</button><pre id="logOut"></pre></div>\
  ';
  document.body.appendChild(container);
}

function sanitizeEmail(e){ return e.trim().toLowerCase().replace(/\./g,'_'); }

function banUser(){ var e=document.getElementById('targetE').value; db.ref('admin/ban/'+sanitizeEmail(e)).set(true); log('ban '+e); alert('Banned'); }
function unbanUser(){ var e=document.getElementById('targetE').value; db.ref('admin/ban/'+sanitizeEmail(e)).remove(); log('unban '+e); alert('Unbanned'); }
function muteUser(){ var e=document.getElementById('muteE').value; db.ref('admin/mute/'+sanitizeEmail(e)).set(true); log('mute '+e); alert('Muted'); }
function unmuteUser(){ var e=document.getElementById('muteE').value; db.ref('admin/mute/'+sanitizeEmail(e)).remove(); log('unmute '+e); alert('Unmuted'); }
function muteAll(){ db.ref('admin/mute_all').set(true); log('mute_all'); alert('Muted all'); }
function unmuteAll(){ db.ref('admin/mute_all').remove(); log('unmute_all'); alert('Unmuted all'); }

function deleteMessage(){ var key=document.getElementById('delMsg').value.trim(); if(!key) return alert('enter key'); db.ref('messages/'+key).remove(); log('delmsg '+key); alert('Deleted'); }

function forceLogout(){ var uid=document.getElementById('forceUid').value.trim(); if(!uid) return alert('enter uid'); db.ref('force_logout/'+uid).set(true); log('force_logout '+uid); alert('Force logout signal sent'); }

function toggleShadowMute(){ var e=document.getElementById('shadowE').value; var k=sanitizeEmail(e); db.ref('admin/shadow/'+k).once('value').then(function(s){ if(s.val()){ db.ref('admin/shadow/'+k).remove(); log('unshadow '+e); alert('Shadow unmuted'); } else { db.ref('admin/shadow/'+k).set(true); log('shadow '+e); alert('Shadow muted'); } }); }

function viewLogs(){ db.ref('admin/logs').limitToLast(200).once('value').then(function(s){ document.getElementById('logOut').textContent = JSON.stringify(s.val(),null,2); }); }

function log(msg){ db.ref('admin/logs').push({msg:msg,ts:Date.now(),by:firebase.auth().currentUser ? firebase.auth().currentUser.email : 'system'}); }

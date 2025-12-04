// Main app logic for both public and admin pages
import { db, resultsCol } from './firebase.js';
import { addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';


// Utility: format timestamp
function tsToStr(ts){
if(!ts) return '';
const d = ts.toDate ? ts.toDate() : new Date();
return d.toLocaleString();
}


// LISTENER: listen to all results ordered by event
const q = query(resultsCol, orderBy('event'));


onSnapshot(q, snapshot => {
const items = [];
snapshot.forEach(docSnap => {
items.push({ id: docSnap.id, ...docSnap.data() });
});


// If public page exists, render
const resultsBody = document.getElementById('resultsBody');
if(resultsBody){
renderPublicTable(items);
renderMedalTally(items);
}


// If admin page exists, render admin list
const adminBody = document.getElementById('adminBody');
if(adminBody){
renderAdminList(items);
}
});


// PUBLIC: render table rows
function renderPublicTable(items){
const tbody = document.getElementById('resultsBody');
tbody.innerHTML = '';
items.forEach(it => {
const tr = document.createElement('tr');
tr.innerHTML = `
<td>${escapeHtml(it.event)}</td>
<td>${escapeHtml(it.category||'')}</td>
<td>${escapeHtml(it.first||'')}</td>
<td>${escapeHtml(it.second||'')}</td>
<td>${escapeHtml(it.third||'')}</td>
<td>${it.points||''}</td>
<td>${tsToStr(it.updatedAt)}</td>
`;
tbody.appendChild(tr);
});
}


// MEDAL TALLY: simple count by team/name
function renderMedalTally(items){
const tally = {}; // name -> {gold,silver,bronze,points}
items.forEach(it => {
if(it.first){ tally[it.first] = tally[it.first] || {gold:0,silver:0,bronze:0,points:0}; tally[it.first].gold++; }
if(it.second){ tally[it.second] = tally[it.second] || {gold:0,silver:0,bronze:0,points:0}; tally[it.second].silver++; }
if(it.third){ tally[it.third] = tally[it.third] || {gold:0,silver:0,bronze:0,points:0}; tally[it.third].bronze++; }
if(it.points && typeof it.points === 'number'){
// assign points to first place if provided
if(it.first) tally[it.first].points += it.points;
}
});


const arr = Object.entries(tally).map(([name, val]) => ({name, ...val}));
arr.sort((a,b) => (b.gold - a.gold) || (b.silver - a.silver) || (b.bronze - a.bronze) || (b.points - a.points));


const targ = document.getElementById('tallyList');
if(!targ) return;
if(arr.length===0) { targ.innerHTML = '<p>No medal data yet</p>'; return; }


const table = document.createElement('table');
table.innerHTML = '<thead><tr><th>Name/Team</th><th>G</th><th>S</th><th>B</th><th>Pts</th></tr></thead>';
const b = document.createElement('tbody');
arr.forEach(r => {
const rtr = document.createElement('tr');
rtr.innerHTML = `<td>${escapeHtml(r.name)}</td><td>${r.gold}</td><td>${r.silver}</td><td>${r.bronze}</td><td>${r.points}</td>`;
}
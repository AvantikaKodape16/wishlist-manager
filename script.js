let items = JSON.parse(localStorage.getItem('wishlist') || '[]');
let calendarVisible = false;
let focusMode = false;

document.addEventListener("DOMContentLoaded", () => {
  renderList();
  setInterval(showRandomQuote, 10000);
  showRandomQuote();

  // Attach event listeners here to ensure the buttons work
  document.getElementById('modeToggle').addEventListener('click', toggleDarkMode);
  document.querySelector('button[onclick="toggleCalendar()"]').addEventListener('click', toggleCalendar);
  document.querySelector('button[onclick="enterFocusMode()"]').addEventListener('click', enterFocusMode);
  document.querySelector('button[onclick="exportList()"]').addEventListener('click', exportList);

  // Filter button listeners
  document.querySelector("button[onclick='filterList(\"all\")']").addEventListener('click', () => filterList('all'));
  document.querySelector("button[onclick='filterList(\"done\")']").addEventListener('click', () => filterList('done'));
  document.querySelector("button[onclick='filterList(\"pending\")']").addEventListener('click', () => filterList('pending'));
});

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const modeButton = document.getElementById('modeToggle');
  modeButton.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

function addLink() {
  const title = document.getElementById('title').value;
  const url = document.getElementById('url').value;
  const deadline = document.getElementById('deadline').value;
  const tag = document.getElementById('tag').value;

  if (!title || !url) return;

  items.push({ title, url, done: false, deadline, tag });
  save();
  renderList();
  clearInputs();
}

function renderList(filteredItems = items) {
  const list = document.getElementById('wishlist');
  list.innerHTML = ''; // Clear the current list
  filteredItems.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = item.done ? 'done' : '';
    li.innerHTML = `
      <a href="${item.url}" target="_blank">${item.title}</a>
      <span class="tag">${item.tag}</span>
      <div class="actions">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleDone(${i})" />
        <button onclick="removeItem(${i})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function toggleDone(i) {
  items[i].done = !items[i].done;
  save();
  renderList();
}

function removeItem(i) {
  items.splice(i, 1);
  save();
  renderList();
}

function save() {
  localStorage.setItem('wishlist', JSON.stringify(items));
}

function clearInputs() {
  document.getElementById('title').value = '';
  document.getElementById('url').value = '';
  document.getElementById('deadline').value = '';
  document.getElementById('tag').value = 'General';
}

function searchItems() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchTerm));
  renderFilteredList(filteredItems);
}

function renderFilteredList(filteredItems) {
  const list = document.getElementById('wishlist');
  list.innerHTML = '';
  filteredItems.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = item.done ? 'done' : '';
    li.innerHTML = `
      <a href="${item.url}" target="_blank">${item.title}</a>
      <span class="tag">${item.tag}</span>
      <div class="actions">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleDone(${i})" />
        <button onclick="removeItem(${i})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function showRandomQuote() {
  const quote = document.getElementById('quote');
  const suggestions = [
    "✨ Progress, not perfection.",
    "🎯 One step at a time!",
    "🌱 Growth happens daily.",
    "💡 Small tasks lead to big wins."
  ];
  quote.innerText = suggestions[Math.floor(Math.random() * suggestions.length)];
}

function filterList(status) {
  let filteredItems = [];
  if (status === 'done') {
    filteredItems = items.filter(item => item.done);
  } else if (status === 'pending') {
    filteredItems = items.filter(item => !item.done);
  } else {
    filteredItems = items; // 'all' status
  }
  renderList(filteredItems);
}

function toggleCalendar() {
  calendarVisible = !calendarVisible;
  const calendarDiv = document.createElement('div');
  calendarDiv.id = 'calendar';
  document.body.appendChild(calendarDiv);
  $('#calendar').fullCalendar({
    events: items.map(item => ({
      title: item.title,
      start: item.deadline,
    })),
  });
}

function enterFocusMode() {
  focusMode = !focusMode;
  if (focusMode) {
    document.getElementById('wishlist').innerHTML = '';
    document.getElementById('wishlist').innerHTML = `
      <li>
        <a href="#">Focus Task</a>
        <button onclick="exitFocusMode()">Exit Focus Mode</button>
      </li>
    `;
  } else {
    renderList();
  }
}

function exitFocusMode() {
  focusMode = false;
  renderList();
}

function exportList() {
  const data = JSON.stringify(items);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wishlist.json';
  a.click();
  URL.revokeObjectURL(url);
}

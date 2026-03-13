// Greeting and DateTime
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = document.getElementById('greeting');
    
    if (hour < 12) {
        greeting.textContent = 'Good Morning';
    } else if (hour < 18) {
        greeting.textContent = 'Good Afternoon';
    } else {
        greeting.textContent = 'Good Evening';
    }
    
    const datetime = document.getElementById('datetime');
    datetime.textContent = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Focus Timer
let timerInterval;
let timerMinutes = 25;
let timeLeft = timerMinutes * 60;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById('set-timer-btn').addEventListener('click', () => {
    const input = document.getElementById('timer-minutes');
    const minutes = parseInt(input.value);
    
    if (minutes && minutes > 0 && minutes <= 120) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerMinutes = minutes;
        timeLeft = timerMinutes * 60;
        updateTimerDisplay();
    } else {
        alert('Please enter a valid number between 1 and 120 minutes');
    }
});

document.getElementById('start-btn').addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert('Focus session complete!');
            }
        }, 1000);
    }
});

document.getElementById('stop-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = timerMinutes * 60;
    updateTimerDisplay();
});

// To-Do List
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.done ? 'done' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
            <span class="task-text" ondblclick="editTask(${index})">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    
    if (text) {
        const isDuplicate = tasks.some(task => task.text.toLowerCase() === text.toLowerCase());
        
        if (isDuplicate) {
            alert('This task already exists!');
            return;
        }
        
        tasks.push({ text, done: false, createdAt: Date.now() });
        saveTasks();
        renderTasks();
        input.value = '';
    }
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText !== null && newText.trim()) {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function deleteTask(index) {
    if (confirm('Delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Sort functions
document.getElementById('sort-az').addEventListener('click', () => {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    saveTasks();
    renderTasks();
});

document.getElementById('sort-za').addEventListener('click', () => {
    tasks.sort((a, b) => b.text.localeCompare(a.text));
    saveTasks();
    renderTasks();
});

document.getElementById('sort-date').addEventListener('click', () => {
    tasks.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    saveTasks();
    renderTasks();
});

// Quick Links
let links = JSON.parse(localStorage.getItem('links')) || [];

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = '';
    
    links.forEach((link, index) => {
        const linkDiv = document.createElement('div');
        linkDiv.style.position = 'relative';
        
        linkDiv.innerHTML = `
            <a href="${link.url}" target="_blank" class="link-btn">${link.name}</a>
            <button class="delete-link" onclick="deleteLink(${index})">×</button>
        `;
        
        container.appendChild(linkDiv);
    });
}

function addLink() {
    const nameInput = document.getElementById('link-name');
    const urlInput = document.getElementById('link-url');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    
    if (name && url) {
        links.push({ name, url });
        saveLinks();
        renderLinks();
        nameInput.value = '';
        urlInput.value = '';
    }
}

function deleteLink(index) {
    if (confirm('Delete this link?')) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }
}

document.getElementById('add-link-btn').addEventListener('click', addLink);

// Initialize
updateGreeting();
setInterval(updateGreeting, 60000);
renderTasks();
renderLinks();

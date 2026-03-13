// ===== StorageService =====
const StorageService = {
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    }
};

// ===== TimeManager =====
const TimeManager = {
    init() {
        this.updateGreeting();
        setInterval(() => this.updateGreeting(), 60000);
    },
    
    updateGreeting() {
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
};

// ===== TimerController =====
const TimerController = {
    timerInterval: null,
    timerMinutes: 25,
    timeLeft: 25 * 60,
    
    init() {
        this.updateDisplay();
        document.getElementById('set-timer-btn').addEventListener('click', () => this.setTimer());
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('stop-btn').addEventListener('click', () => this.stop());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
    },
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    setTimer() {
        const input = document.getElementById('timer-minutes');
        const minutes = parseInt(input.value);
        
        if (minutes && minutes > 0 && minutes <= 120) {
            this.stop();
            this.timerMinutes = minutes;
            this.timeLeft = this.timerMinutes * 60;
            this.updateDisplay();
        } else {
            alert('Please enter a valid number between 1 and 120 minutes');
        }
    },
    
    start() {
        if (!this.timerInterval) {
            this.timerInterval = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                    this.updateDisplay();
                } else {
                    this.stop();
                    alert('Focus session complete!');
                }
            }, 1000);
        }
    },
    
    stop() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    },
    
    reset() {
        this.stop();
        this.timeLeft = this.timerMinutes * 60;
        this.updateDisplay();
    }
};

// ===== TaskManager =====
const TaskManager = {
    tasks: [],
    
    init() {
        this.tasks = StorageService.get('tasks') || [];
        this.render();
        
        document.getElementById('add-task-btn').addEventListener('click', () => this.add());
        document.getElementById('task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.add();
        });
        
        document.getElementById('sort-az').addEventListener('click', () => this.sortAZ());
        document.getElementById('sort-za').addEventListener('click', () => this.sortZA());
        document.getElementById('sort-date').addEventListener('click', () => this.sortByDate());
    },
    
    save() {
        StorageService.set('tasks', this.tasks);
    },
    
    render() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        
        this.tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.done ? 'done' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${task.done ? 'checked' : ''} onchange="TaskManager.toggle(${index})">
                <span class="task-text" ondblclick="TaskManager.edit(${index})">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn" onclick="TaskManager.edit(${index})">Edit</button>
                    <button class="delete-btn" onclick="TaskManager.delete(${index})">Delete</button>
                </div>
            `;
            
            taskList.appendChild(li);
        });
    },
    
    add() {
        const input = document.getElementById('task-input');
        const text = input.value.trim();
        
        if (text) {
            const isDuplicate = this.tasks.some(task => task.text.toLowerCase() === text.toLowerCase());
            
            if (isDuplicate) {
                alert('This task already exists!');
                return;
            }
            
            this.tasks.push({ text, done: false, createdAt: Date.now() });
            this.save();
            this.render();
            input.value = '';
        }
    },
    
    toggle(index) {
        this.tasks[index].done = !this.tasks[index].done;
        this.save();
        this.render();
    },
    
    edit(index) {
        const newText = prompt('Edit task:', this.tasks[index].text);
        if (newText !== null && newText.trim()) {
            this.tasks[index].text = newText.trim();
            this.save();
            this.render();
        }
    },
    
    delete(index) {
        if (confirm('Delete this task?')) {
            this.tasks.splice(index, 1);
            this.save();
            this.render();
        }
    },
    
    sortAZ() {
        this.tasks.sort((a, b) => a.text.localeCompare(b.text));
        this.save();
        this.render();
    },
    
    sortZA() {
        this.tasks.sort((a, b) => b.text.localeCompare(a.text));
        this.save();
        this.render();
    },
    
    sortByDate() {
        this.tasks.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        this.save();
        this.render();
    }
};

// ===== LinkManager =====
const LinkManager = {
    links: [],
    
    init() {
        this.links = StorageService.get('links') || [];
        this.render();
        
        document.getElementById('add-link-btn').addEventListener('click', () => this.add());
    },
    
    save() {
        StorageService.set('links', this.links);
    },
    
    render() {
        const container = document.getElementById('links-container');
        container.innerHTML = '';
        
        this.links.forEach((link, index) => {
            const linkDiv = document.createElement('div');
            linkDiv.style.position = 'relative';
            
            linkDiv.innerHTML = `
                <a href="${link.url}" target="_blank" class="link-btn">${link.name}</a>
                <button class="delete-link" onclick="LinkManager.delete(${index})">×</button>
            `;
            
            container.appendChild(linkDiv);
        });
    },
    
    add() {
        const nameInput = document.getElementById('link-name');
        const urlInput = document.getElementById('link-url');
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        
        if (name && url) {
            this.links.push({ name, url });
            this.save();
            this.render();
            nameInput.value = '';
            urlInput.value = '';
        }
    },
    
    delete(index) {
        if (confirm('Delete this link?')) {
            this.links.splice(index, 1);
            this.save();
            this.render();
        }
    }
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    TimeManager.init();
    TimerController.init();
    TaskManager.init();
    LinkManager.init();
});

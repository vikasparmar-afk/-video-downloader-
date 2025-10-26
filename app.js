class DailyWorkManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
        this.settings = JSON.parse(localStorage.getItem('dailySettings')) || {
            notificationsEnabled: false,
            dailyReminderTime: '09:00',
            taskReminderEnabled: true,
            dailySummaryEnabled: true
        };
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        this.renderTodayTasks();
        this.updateNotificationStatus();
        this.scheduleNotifications();
        this.setTodayAsDefault();
    }

    setTodayAsDefault() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').value = today;
    }

    bindEvents() {
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Notification button
        document.getElementById('notificationBtn').addEventListener('click', () => {
            this.requestNotificationPermission();
        });

        // Settings modal
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideSettings();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Modal close on backdrop click
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.hideSettings();
            }
        });
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                this.settings.notificationsEnabled = true;
                this.saveToStorage();
                this.updateNotificationStatus();
                this.scheduleNotifications();
                
                // Show test notification
                new Notification('Daily Work Manager', {
                    body: 'Notifications are now enabled!',
                    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPgo='
                });
            } else {
                alert('Notifications permission denied. You can enable it later in settings.');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }

    updateNotificationStatus() {
        const statusEl = document.getElementById('notificationStatus');
        const indicatorEl = statusEl.querySelector('.status-indicator');
        const textEl = statusEl.querySelector('.status-text');
        const btnEl = document.getElementById('notificationBtn');

        if (this.settings.notificationsEnabled && Notification.permission === 'granted') {
            indicatorEl.classList.add('enabled');
            textEl.textContent = 'Notifications Enabled';
            btnEl.innerHTML = '<i class="fas fa-bell"></i> Notifications ON';
            btnEl.classList.add('btn-primary');
            btnEl.classList.remove('btn-secondary');
        } else {
            indicatorEl.classList.remove('enabled');
            textEl.textContent = 'Notifications Disabled';
            btnEl.innerHTML = '<i class="fas fa-bell-slash"></i> Enable Notifications';
            btnEl.classList.add('btn-secondary');
            btnEl.classList.remove('btn-primary');
        }
    }

    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const time = document.getElementById('taskTime').value;
        const description = document.getElementById('taskDescription').value.trim();

        if (!title || !dueDate) {
            alert('Please fill in the required fields');
            return;
        }

        const task = {
            id: Date.now().toString(),
            title,
            description,
            priority,
            dueDate,
            time,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveToStorage();
        this.renderTasks();
        this.renderTodayTasks();
        
        // Reset form
        document.getElementById('taskForm').reset();
        this.setTodayAsDefault();
        
        // Schedule notification for this task
        if (this.settings.notificationsEnabled && time) {
            this.scheduleTaskNotification(task);
        }

        // Show success feedback
        this.showNotification(`Task "${title}" added successfully!`, 'success');
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveToStorage();
            this.renderTasks();
            this.renderTodayTasks();
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveToStorage();
            this.renderTasks();
            this.renderTodayTasks();
            
            if (task.completed) {
                this.showNotification(`Task "${task.title}" completed!`, 'success');
            }
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.renderTasks();
    }

    getFilteredTasks() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        switch (this.currentFilter) {
            case 'today':
                return this.tasks.filter(task => task.dueDate === today);
            case 'upcoming':
                return this.tasks.filter(task => task.dueDate > today && !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '<p class="empty-state">No tasks found for this filter.</p>';
            return;
        }

        tasksList.innerHTML = filteredTasks
            .sort((a, b) => {
                // Sort by priority, then by due date
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                return new Date(a.dueDate) - new Date(b.dueDate);
            })
            .map(task => this.createTaskHTML(task))
            .join('');
    }

    renderTodayTasks() {
        const todayTasksEl = document.getElementById('todayTasks');
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = this.tasks.filter(task => 
            task.dueDate === today && !task.completed
        );

        if (todayTasks.length === 0) {
            todayTasksEl.innerHTML = '<p class="empty-state">No important tasks for today. Great job!</p>';
            return;
        }

        todayTasksEl.innerHTML = todayTasks
            .sort((a, b) => {
                const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            })
            .map(task => `
                <div class="today-task">
                    <div class="today-task-header">
                        <h4>${task.title}</h4>
                        <span class="task-priority priority-${task.priority}">
                            ${task.priority.toUpperCase()}
                        </span>
                    </div>
                    ${task.description ? `<p>${task.description}</p>` : ''}
                    ${task.time ? `<div class="task-meta"><i class="fas fa-clock"></i> ${task.time}</div>` : ''}
                </div>
            `).join('');
    }

    createTaskHTML(task) {
        const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toLocaleDateString();
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div>
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">
                            <span class="task-priority priority-${task.priority}">
                                ${task.priority.toUpperCase()}
                            </span>
                            <span class="${isOverdue ? 'overdue' : ''}">
                                <i class="fas fa-calendar"></i> ${formattedDate}
                            </span>
                            ${task.time ? `<span><i class="fas fa-clock"></i> ${task.time}</span>` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button onclick="app.toggleTask('${task.id}')" class="complete-btn" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
                            <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                        </button>
                        <button onclick="app.deleteTask('${task.id}')" class="delete-btn" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            </div>
        `;
    }

    showSettings() {
        const modal = document.getElementById('settingsModal');
        const dailyTimeInput = document.getElementById('dailyReminderTime');
        const taskReminderInput = document.getElementById('taskReminderEnabled');
        const dailySummaryInput = document.getElementById('dailySummaryEnabled');

        dailyTimeInput.value = this.settings.dailyReminderTime;
        taskReminderInput.checked = this.settings.taskReminderEnabled;
        dailySummaryInput.checked = this.settings.dailySummaryEnabled;

        modal.style.display = 'block';
    }

    hideSettings() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    saveSettings() {
        this.settings.dailyReminderTime = document.getElementById('dailyReminderTime').value;
        this.settings.taskReminderEnabled = document.getElementById('taskReminderEnabled').checked;
        this.settings.dailySummaryEnabled = document.getElementById('dailySummaryEnabled').checked;

        this.saveToStorage();
        this.scheduleNotifications();
        this.hideSettings();
        
        this.showNotification('Settings saved successfully!', 'success');
    }

    scheduleNotifications() {
        if (!this.settings.notificationsEnabled || Notification.permission !== 'granted') {
            return;
        }

        // Schedule daily summary
        if (this.settings.dailySummaryEnabled) {
            this.scheduleDailySummary();
        }

        // Schedule task reminders
        if (this.settings.taskReminderEnabled) {
            this.scheduleTaskReminders();
        }
    }

    scheduleDailySummary() {
        const now = new Date();
        const [hours, minutes] = this.settings.dailyReminderTime.split(':');
        const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // If time has passed today, schedule for tomorrow
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const timeUntilReminder = reminderTime.getTime() - now.getTime();

        setTimeout(() => {
            this.sendDailySummaryNotification();
            // Schedule next day
            setInterval(() => {
                this.sendDailySummaryNotification();
            }, 24 * 60 * 60 * 1000);
        }, timeUntilReminder);
    }

    sendDailySummaryNotification() {
        const today = new Date().toISOString().split('T')[0];
        const todayTasks = this.tasks.filter(task => task.dueDate === today && !task.completed);
        
        if (todayTasks.length > 0) {
            const priorityTasks = todayTasks.filter(task => task.priority === 'high' || task.priority === 'critical');
            const message = priorityTasks.length > 0 
                ? `Good morning! You have ${todayTasks.length} tasks today, including ${priorityTasks.length} high-priority tasks.`
                : `Good morning! You have ${todayTasks.length} tasks scheduled for today.`;

            new Notification('Daily Work Summary', {
                body: message,
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMjU2M0VCIi8+Cjwvc3ZnPgo='
            });
        }
    }

    scheduleTaskReminders() {
        const now = new Date();
        
        this.tasks.forEach(task => {
            if (task.completed || !task.time) return;
            
            const taskDateTime = new Date(`${task.dueDate}T${task.time}`);
            const timeUntilTask = taskDateTime.getTime() - now.getTime();
            
            // Schedule notification 10 minutes before the task
            const reminderTime = timeUntilTask - (10 * 60 * 1000);
            
            if (reminderTime > 0) {
                setTimeout(() => {
                    this.sendTaskReminder(task);
                }, reminderTime);
            }
        });
    }

    scheduleTaskNotification(task) {
        if (!this.settings.notificationsEnabled || !task.time) return;
        
        const now = new Date();
        const taskDateTime = new Date(`${task.dueDate}T${task.time}`);
        const timeUntilTask = taskDateTime.getTime() - now.getTime();
        const reminderTime = timeUntilTask - (10 * 60 * 1000);
        
        if (reminderTime > 0) {
            setTimeout(() => {
                this.sendTaskReminder(task);
            }, reminderTime);
        }
    }

    sendTaskReminder(task) {
        if (task.completed) return;
        
        new Notification(`Task Reminder: ${task.title}`, {
            body: `Scheduled for ${task.time}. Priority: ${task.priority.toUpperCase()}`,
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRUE1ODBDII8+Cjwvc3ZnPgo=',
            requireInteraction: true
        });
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add toast styles if not exists
        if (!document.getElementById('toastStyles')) {
            const style = document.createElement('style');
            style.id = 'toastStyles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: var(--shadow-lg);
                    z-index: 1001;
                    animation: slideInRight 0.3s ease;
                }
                .toast-success { border-left: 4px solid var(--success-color); }
                .toast-info { border-left: 4px solid var(--primary-color); }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    saveToStorage() {
        localStorage.setItem('dailyTasks', JSON.stringify(this.tasks));
        localStorage.setItem('dailySettings', JSON.stringify(this.settings));
    }

    // Export/Import functionality
    exportData() {
        const data = {
            tasks: this.tasks,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-work-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.tasks && data.settings) {
                    this.tasks = data.tasks;
                    this.settings = data.settings;
                    this.saveToStorage();
                    this.renderTasks();
                    this.renderTodayTasks();
                    this.updateNotificationStatus();
                    this.showNotification('Data imported successfully!', 'success');
                }
            } catch (error) {
                alert('Invalid backup file');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app
const app = new DailyWorkManager();

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to quickly add task
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            document.getElementById('taskForm').dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        app.hideSettings();
    }
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, continue without offline support
    });
}

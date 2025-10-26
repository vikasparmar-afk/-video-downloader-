// Daily Task Reminder App - JavaScript
class DailyTaskReminder {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
        this.completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {};
        this.streak = parseInt(localStorage.getItem('taskStreak')) || 0;
        this.lastCompletionDate = localStorage.getItem('lastCompletionDate') || '';
        
        // Initialize WhatsApp notifier
        this.whatsappNotifier = new WhatsAppNotifier();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkNotificationPermission();
        this.renderTasks();
        this.updateStats();
        this.startReminderSystem();
        this.updateStreak();
    }

    setupEventListeners() {
        // Task form submission
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Edit task form submission
        document.getElementById('edit-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateTask();
        });

        // Filter controls
        document.getElementById('filter-category').addEventListener('change', () => this.renderTasks());
        document.getElementById('filter-status').addEventListener('change', () => this.renderTasks());

        // Notification permission
        document.getElementById('enable-notifications').addEventListener('click', () => {
            this.requestNotificationPermission();
        });

        document.getElementById('dismiss-banner').addEventListener('click', () => {
            document.getElementById('notification-banner').classList.add('hidden');
            localStorage.setItem('notificationBannerDismissed', 'true');
        });

        // Modal controls
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-edit').addEventListener('click', () => this.closeModal());
        
        // Click outside modal to close
        document.getElementById('task-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('task-modal')) {
                this.closeModal();
            }
        });
    }

    addTask() {
        const title = document.getElementById('task-title').value.trim();
        const category = document.getElementById('task-category').value;
        const reminderTime = document.getElementById('reminder-time').value;
        const repeatFrequency = document.getElementById('repeat-frequency').value;
        const notes = document.getElementById('task-notes').value.trim();

        if (!title || !reminderTime) {
            alert('Please fill in all required fields');
            return;
        }

        const task = {
            id: Date.now().toString(),
            title,
            category,
            reminderTime,
            repeatFrequency,
            notes,
            created: new Date().toISOString(),
            active: true
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        // Clear form
        document.getElementById('task-form').reset();
        
        // Show success message
        this.showNotification('Task added successfully!', 'success');
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Populate edit form
        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-category').value = task.category;
        document.getElementById('edit-reminder-time').value = task.reminderTime;
        document.getElementById('edit-repeat-frequency').value = task.repeatFrequency;
        document.getElementById('edit-task-notes').value = task.notes || '';

        // Show modal
        document.getElementById('task-modal').classList.remove('hidden');
    }

    updateTask() {
        const taskId = document.getElementById('edit-task-id').value;
        const title = document.getElementById('edit-task-title').value.trim();
        const category = document.getElementById('edit-task-category').value;
        const reminderTime = document.getElementById('edit-reminder-time').value;
        const repeatFrequency = document.getElementById('edit-repeat-frequency').value;
        const notes = document.getElementById('edit-task-notes').value.trim();

        if (!title || !reminderTime) {
            alert('Please fill in all required fields');
            return;
        }

        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            title,
            category,
            reminderTime,
            repeatFrequency,
            notes,
            updated: new Date().toISOString()
        };

        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.closeModal();
        
        this.showNotification('Task updated successfully!', 'success');
    }

    deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        this.showNotification('Task deleted successfully!', 'success');
    }

    toggleTask(taskId) {
        const today = new Date().toDateString();
        
        if (!this.completedTasks[today]) {
            this.completedTasks[today] = [];
        }

        const completedIndex = this.completedTasks[today].indexOf(taskId);
        
        if (completedIndex === -1) {
            // Mark as completed
            this.completedTasks[today].push(taskId);
            this.showNotification('Great job! Task completed! 🎉', 'success');
        } else {
            // Mark as incomplete
            this.completedTasks[today].splice(completedIndex, 1);
        }

        this.saveCompletedTasks();
        this.renderTasks();
        this.updateStats();
        this.updateStreak();
    }

    isTaskCompleted(taskId) {
        const today = new Date().toDateString();
        return this.completedTasks[today] && this.completedTasks[today].includes(taskId);
    }

    shouldShowTask(task, today) {
        const todayDate = new Date(today);
        const dayOfWeek = todayDate.getDay(); // 0 = Sunday, 6 = Saturday

        switch (task.repeatFrequency) {
            case 'daily':
                return true;
            case 'weekdays':
                return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
            case 'weekends':
                return dayOfWeek === 0 || dayOfWeek === 6; // Saturday and Sunday
            case 'weekly':
                // For weekly, we'll show it every 7 days from creation
                const createdDate = new Date(task.created);
                const daysDiff = Math.floor((todayDate - createdDate) / (1000 * 60 * 60 * 24));
                return daysDiff % 7 === 0;
            default:
                return true;
        }
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        const categoryFilter = document.getElementById('filter-category').value;
        const statusFilter = document.getElementById('filter-status').value;
        const today = new Date().toDateString();

        let filteredTasks = this.tasks.filter(task => {
            // Category filter
            if (categoryFilter !== 'all' && task.category !== categoryFilter) {
                return false;
            }

            // Status filter
            const isCompleted = this.isTaskCompleted(task.id);
            if (statusFilter === 'completed' && !isCompleted) {
                return false;
            }
            if (statusFilter === 'pending' && isCompleted) {
                return false;
            }

            // Check if task should show today based on repeat frequency
            return this.shouldShowTask(task, today);
        });

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>🎯 No tasks match your current filters.</p>
                </div>
            `;
            return;
        }

        // Sort tasks: incomplete first, then by reminder time
        filteredTasks.sort((a, b) => {
            const aCompleted = this.isTaskCompleted(a.id);
            const bCompleted = this.isTaskCompleted(b.id);
            
            if (aCompleted !== bCompleted) {
                return aCompleted ? 1 : -1;
            }
            
            return a.reminderTime.localeCompare(b.reminderTime);
        });

        container.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');
    }

    renderTask(task) {
        const isCompleted = this.isTaskCompleted(task.id);
        const categoryEmojis = {
            reading: '📚',
            exercise: '🏃',
            work: '💼',
            study: '📖',
            personal: '🏠',
            health: '🏥',
            other: '📝'
        };

        return `
            <div class="task-item ${isCompleted ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div>
                        <div class="task-title">${task.title}</div>
                        <span class="task-category">${categoryEmojis[task.category]} ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
                    </div>
                </div>
                
                <div class="task-meta">
                    ⏰ ${this.formatTime(task.reminderTime)} • 🔄 ${task.repeatFrequency}
                </div>
                
                ${task.notes ? `<div class="task-notes">${task.notes}</div>` : ''}
                
                <div class="task-status">
                    <div class="status-indicator ${isCompleted ? 'completed' : ''}"></div>
                    <span>${isCompleted ? 'Completed' : 'Pending'}</span>
                </div>
                
                <div class="task-actions">
                    <button class="btn btn-small ${isCompleted ? 'btn-secondary' : 'btn-success'}" 
                            onclick="taskReminder.toggleTask('${task.id}')">
                        ${isCompleted ? '↩️ Undo' : '✅ Complete'}
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="taskReminder.editTask('${task.id}')">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-small btn-danger" onclick="taskReminder.deleteTask('${task.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }

    formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    updateStats() {
        const today = new Date().toDateString();
        const todaysTasks = this.tasks.filter(task => this.shouldShowTask(task, today));
        const completedToday = this.completedTasks[today] || [];
        
        document.getElementById('today-count').textContent = todaysTasks.length;
        document.getElementById('completed-count').textContent = completedToday.length;
        document.getElementById('streak-count').textContent = this.streak;

        // Update progress bars
        this.updateProgressBars();
    }

    updateProgressBars() {
        // Week progress
        const weekProgress = this.calculateWeekProgress();
        document.getElementById('week-progress').style.width = `${weekProgress}%`;
        document.getElementById('week-percentage').textContent = `${Math.round(weekProgress)}%`;

        // Month progress
        const monthProgress = this.calculateMonthProgress();
        document.getElementById('month-progress').style.width = `${monthProgress}%`;
        document.getElementById('month-percentage').textContent = `${Math.round(monthProgress)}%`;
    }

    calculateWeekProgress() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        let totalTasks = 0;
        let completedTasks = 0;

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateString = date.toDateString();
            
            const dayTasks = this.tasks.filter(task => this.shouldShowTask(task, dateString));
            totalTasks += dayTasks.length;
            
            if (this.completedTasks[dateString]) {
                completedTasks += this.completedTasks[dateString].length;
            }
        }

        return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    }

    calculateMonthProgress() {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        let totalTasks = 0;
        let completedTasks = 0;

        for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
            const dateString = date.toDateString();
            
            const dayTasks = this.tasks.filter(task => this.shouldShowTask(task, dateString));
            totalTasks += dayTasks.length;
            
            if (this.completedTasks[dateString]) {
                completedTasks += this.completedTasks[dateString].length;
            }
        }

        return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    }

    updateStreak() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        const todayString = today.toDateString();
        const yesterdayString = yesterday.toDateString();
        
        const todaysTasks = this.tasks.filter(task => this.shouldShowTask(task, todayString));
        const todaysCompleted = this.completedTasks[todayString] || [];
        
        // Check if all today's tasks are completed
        const allTodayTasksCompleted = todaysTasks.length > 0 && 
            todaysTasks.every(task => todaysCompleted.includes(task.id));

        if (allTodayTasksCompleted && this.lastCompletionDate !== todayString) {
            if (this.lastCompletionDate === yesterdayString) {
                this.streak++;
            } else {
                this.streak = 1;
            }
            this.lastCompletionDate = todayString;
            localStorage.setItem('taskStreak', this.streak.toString());
            localStorage.setItem('lastCompletionDate', this.lastCompletionDate);
        }
    }

    // Notification System
    checkNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default' && 
                !localStorage.getItem('notificationBannerDismissed')) {
                document.getElementById('notification-banner').classList.remove('hidden');
            }
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showNotification('Notifications enabled! You\'ll receive reminders for your tasks.', 'success');
                document.getElementById('notification-banner').classList.add('hidden');
            }
        }
    }

    startReminderSystem() {
        // Check for reminders every minute
        setInterval(() => {
            this.checkReminders();
        }, 60000);

        // Check immediately
        this.checkReminders();
    }

    checkReminders() {
        const now = new Date();
        const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
        const today = now.toDateString();

        this.tasks.forEach(task => {
            if (task.reminderTime === currentTime && 
                this.shouldShowTask(task, today) && 
                !this.isTaskCompleted(task.id)) {
                
                this.sendNotification(task);
            }
        });
    }

    sendNotification(task) {
        // Send browser notification if enabled
        if ('Notification' in window && Notification.permission === 'granted') {
            const categoryEmojis = {
                reading: '📚',
                exercise: '🏃',
                work: '💼',
                study: '📖',
                personal: '🏠',
                health: '🏥',
                other: '📝'
            };

            new Notification(`${categoryEmojis[task.category]} Task Reminder`, {
                body: `Time for: ${task.title}`,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: task.id,
                requireInteraction: true
            });
        }

        // Send WhatsApp notification if enabled and configured
        if (this.whatsappNotifier.isEnabled()) {
            this.whatsappNotifier.sendTaskReminder(task).catch(error => {
                console.error('WhatsApp notification failed:', error);
                this.showNotification('⚠️ WhatsApp notification failed. Check your settings.', 'warning');
            });
        }

        // Also show in-app notification
        this.showNotification(`🔔 Reminder: ${task.title}`, 'warning');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            maxWidth: '300px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    closeModal() {
        document.getElementById('task-modal').classList.add('hidden');
    }

    // Data persistence
    saveTasks() {
        localStorage.setItem('dailyTasks', JSON.stringify(this.tasks));
    }

    saveCompletedTasks() {
        localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
    }

    // Export/Import functionality
    exportData() {
        const data = {
            tasks: this.tasks,
            completedTasks: this.completedTasks,
            streak: this.streak,
            lastCompletionDate: this.lastCompletionDate,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(fileInput) {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('This will replace all your current data. Are you sure?')) {
                    this.tasks = data.tasks || [];
                    this.completedTasks = data.completedTasks || {};
                    this.streak = data.streak || 0;
                    this.lastCompletionDate = data.lastCompletionDate || '';
                    
                    this.saveTasks();
                    this.saveCompletedTasks();
                    localStorage.setItem('taskStreak', this.streak.toString());
                    localStorage.setItem('lastCompletionDate', this.lastCompletionDate);
                    
                    this.renderTasks();
                    this.updateStats();
                    
                    this.showNotification('Data imported successfully!', 'success');
                }
            } catch (error) {
                this.showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskReminder = new DailyTaskReminder();
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

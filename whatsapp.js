// WhatsApp Integration Module
class WhatsAppNotifier {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('whatsappSettings')) || {
            enabled: false,
            phone: '',
            apiKey: '',
            verified: false
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.updateUI();
    }

    setupEventListeners() {
        // WhatsApp notification toggle
        document.getElementById('whatsapp-notifications').addEventListener('change', (e) => {
            this.toggleWhatsAppConfig(e.target.checked);
        });

        // Save settings
        document.getElementById('save-whatsapp-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Test message
        document.getElementById('test-whatsapp').addEventListener('click', () => {
            this.sendTestMessage();
        });

        // Phone number validation
        document.getElementById('whatsapp-phone').addEventListener('input', (e) => {
            this.validatePhoneNumber(e.target.value);
        });

        // API provider link
        document.getElementById('api-provider-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.openApiProviderInfo();
        });
    }

    toggleWhatsAppConfig(enabled) {
        const config = document.getElementById('whatsapp-config');
        if (enabled) {
            config.classList.remove('hidden');
        } else {
            config.classList.add('hidden');
            this.settings.enabled = false;
            this.saveToStorage();
        }
    }

    loadSettings() {
        // Load saved settings into form
        document.getElementById('whatsapp-notifications').checked = this.settings.enabled;
        document.getElementById('whatsapp-phone').value = this.settings.phone;
        document.getElementById('whatsapp-api-key').value = this.settings.apiKey;
        
        // Show config if enabled
        if (this.settings.enabled) {
            this.toggleWhatsAppConfig(true);
        }
    }

    updateUI() {
        const statusDiv = document.getElementById('whatsapp-status');
        if (this.settings.verified) {
            this.showStatus('✅ WhatsApp notifications configured and working!', 'success');
        } else if (this.settings.enabled) {
            this.showStatus('⚠️ WhatsApp configuration incomplete. Please test your settings.', 'warning');
        }
    }

    validatePhoneNumber(phone) {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        const phoneInput = document.getElementById('whatsapp-phone');
        
        if (phone && !phoneRegex.test(phone)) {
            phoneInput.style.borderColor = '#ef4444';
            this.showStatus('❌ Invalid phone number format. Use +[country code][number]', 'error');
            return false;
        } else {
            phoneInput.style.borderColor = '#10b981';
            return true;
        }
    }

    async saveSettings() {
        const phone = document.getElementById('whatsapp-phone').value.trim();
        const apiKey = document.getElementById('whatsapp-api-key').value.trim();
        const enabled = document.getElementById('whatsapp-notifications').checked;

        if (enabled && (!phone || !apiKey)) {
            this.showStatus('❌ Please fill in both phone number and API key', 'error');
            return;
        }

        if (enabled && !this.validatePhoneNumber(phone)) {
            return;
        }

        this.settings = {
            enabled,
            phone,
            apiKey,
            verified: false
        };

        this.saveToStorage();
        this.showStatus('✅ Settings saved! Please send a test message to verify.', 'success');
    }

    async sendTestMessage() {
        if (!this.settings.phone || !this.settings.apiKey) {
            this.showStatus('❌ Please configure phone number and API key first', 'error');
            return;
        }

        this.showStatus('📤 Sending test message...', 'warning');

        try {
            const success = await this.sendWhatsAppMessage(
                'Test message from Daily Task Reminder! 🎯 Your WhatsApp notifications are working correctly.'
            );

            if (success) {
                this.settings.verified = true;
                this.saveToStorage();
                this.showStatus('✅ Test message sent successfully! WhatsApp notifications are now active.', 'success');
            } else {
                this.showStatus('❌ Failed to send test message. Please check your settings.', 'error');
            }
        } catch (error) {
            console.error('WhatsApp test failed:', error);
            this.showStatus('❌ Error sending test message: ' + error.message, 'error');
        }
    }

    async sendWhatsAppMessage(message) {
        if (!this.settings.enabled || !this.settings.verified) {
            return false;
        }

        try {
            // Using CallMeBot API (free WhatsApp messaging service)
            const url = 'https://api.callmebot.com/whatsapp.php';
            const params = new URLSearchParams({
                phone: this.settings.phone,
                text: message,
                apikey: this.settings.apiKey
            });

            const response = await fetch(`${url}?${params}`, {
                method: 'GET',
                mode: 'no-cors' // Required for CallMeBot API
            });

            // Since we're using no-cors, we can't read the response
            // We'll assume success if no error is thrown
            return true;

        } catch (error) {
            console.error('WhatsApp message failed:', error);
            return false;
        }
    }

    async sendTaskReminder(task) {
        if (!this.settings.enabled || !this.settings.verified) {
            return false;
        }

        const categoryEmojis = {
            reading: '📚',
            exercise: '🏃',
            work: '💼',
            study: '📖',
            personal: '🏠',
            health: '🏥',
            other: '📝'
        };

        const message = `🔔 *Task Reminder*\n\n${categoryEmojis[task.category]} *${task.title}*\n\nTime: ${this.formatTime(task.reminderTime)}\nFrequency: ${task.repeatFrequency}\n\n${task.notes ? `Notes: ${task.notes}\n\n` : ''}Don't forget to complete your task! 💪`;

        return await this.sendWhatsAppMessage(message);
    }

    formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('whatsapp-status');
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type}`;
        statusDiv.classList.remove('hidden');

        // Auto-hide after 5 seconds for non-error messages
        if (type !== 'error') {
            setTimeout(() => {
                statusDiv.classList.add('hidden');
            }, 5000);
        }
    }

    saveToStorage() {
        localStorage.setItem('whatsappSettings', JSON.stringify(this.settings));
    }

    openApiProviderInfo() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3>🔗 WhatsApp API Setup</h3>
                <div style="margin: 1rem 0;">
                    <h4>Using CallMeBot (Free Service)</h4>
                    <ol style="margin: 1rem 0; padding-left: 1.5rem;">
                        <li>Add the phone number <strong>+34 644 41 83 82</strong> to your phone contacts. (Name it CallMeBot)</li>
                        <li>Send this message "I allow callmebot to send me messages" to the new Contact created (using WhatsApp obviously)</li>
                        <li>Wait until you receive the message "API Activated for your phone number. Your APIKEY is: XXXXXXXX" from the bot.</li>
                        <li>The XXXXXXXX is your API key, copy it and paste it in the API Key field above.</li>
                    </ol>
                    <p><strong>Note:</strong> This is a free service with some limitations. For production use, consider WhatsApp Business API.</p>
                    <div style="margin-top: 1rem;">
                        <button class="btn btn-primary" onclick="window.open('https://www.callmebot.com/blog/free-api-whatsapp-messages/', '_blank')">
                            📖 Read Full Instructions
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Public method to check if WhatsApp is enabled and verified
    isEnabled() {
        return this.settings.enabled && this.settings.verified;
    }

    // Public method to get settings
    getSettings() {
        return { ...this.settings };
    }
}

// Export for use in main script
window.WhatsAppNotifier = WhatsAppNotifier;

/**
 * Messenger Widget JavaScript
 * Real-time chat functionality for iborovi website
 */

class Messenger {
    constructor() {
        this.widget = null;
        this.messagesContainer = null;
        this.input = null;
        this.sendButton = null;
        this.toggleButton = null;
        this.isCollapsed = false;
        this.messages = [];
        this.username = 'Гость';
        
        this.init();
    }

    init() {
        this.setupElements();
        this.loadMessages();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    setupElements() {
        this.widget = document.getElementById('messenger-widget');
        this.messagesContainer = document.getElementById('messengerMessages');
        this.input = document.getElementById('messengerInput');
        this.sendButton = document.getElementById('messengerSend');
        this.toggleButton = document.getElementById('messengerToggle');
    }

    bindEvents() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Toggle messenger collapse
        this.toggleButton.addEventListener('click', () => this.toggleCollapse());
        
        // Auto-resize input
        this.input.addEventListener('input', () => this.adjustInputHeight());
        
        // Focus input when clicking anywhere in the widget
        this.widget.addEventListener('click', (e) => {
            if (!e.target.closest('.messenger-toggle')) {
                this.input.focus();
            }
        });
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.widget.classList.toggle('collapsed', this.isCollapsed);
        
        const toggleIcon = this.toggleButton.querySelector('.toggle-icon');
        toggleIcon.textContent = this.isCollapsed ? '+' : '−';
        
        if (!this.isCollapsed) {
            setTimeout(() => this.input.focus(), 300);
            this.scrollToBottom();
        }
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        const message = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date(),
            username: this.username
        };

        this.addMessage(message);
        this.messages.push(message);
        this.saveMessages();
        
        this.input.value = '';
        this.adjustInputHeight();
        this.input.focus();

        // Simulate bot response for demo
        setTimeout(() => {
            this.addBotResponse(text);
        }, 1000 + Math.random() * 2000);
    }

    addBotResponse(userText) {
        const responses = [
            "Спасибо за сообщение! Я обязательно отвечу.",
            "Отлично! Рад, что ты написал.",
            "Интересно! Расскажи подробнее.",
            "Спасибо за участие в чате!",
            "Хороший вопрос! Подумаю над этим.",
            "Класс! Давай продолжим общение.",
            "Очень приятно читать твои сообщения!",
            "Спасибо за поддержку стрима! ❤️"
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage = {
            id: Date.now(),
            text: response,
            sender: 'system',
            timestamp: new Date(),
            username: 'iborovi'
        };

        this.addMessage(botMessage);
        this.messages.push(botMessage);
        this.saveMessages();
    }

    addMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        
        const timeString = this.formatTime(message.timestamp);
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-text">${this.escapeHtml(message.text)}</span>
                <span class="message-time">${timeString}</span>
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addWelcomeMessage() {
        const welcomeMessages = [
            {
                text: "Добро пожаловать в чат iborovi!",
                sender: 'system',
                timestamp: new Date()
            },
            {
                text: "Здесь ты можешь общаться с другими зрителями и задавать вопросы.",
                sender: 'system',
                timestamp: new Date()
            }
        ];

        welcomeMessages.forEach(msg => {
            const message = {
                id: Date.now() + Math.random(),
                ...msg,
                username: 'system'
            };
            this.addMessage(message);
            this.messages.push(message);
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    adjustInputHeight() {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 100) + 'px';
    }

    saveMessages() {
        try {
            localStorage.setItem('messenger_messages', JSON.stringify(this.messages));
        } catch (e) {
            console.warn('Could not save messages to localStorage:', e);
        }
    }

    loadMessages() {
        try {
            const saved = localStorage.getItem('messenger_messages');
            if (saved) {
                this.messages = JSON.parse(saved);
                this.messages.forEach(message => {
                    message.timestamp = new Date(message.timestamp);
                    this.addMessage(message);
                });
            }
        } catch (e) {
            console.warn('Could not load messages from localStorage:', e);
        }
    }

    clearMessages() {
        this.messages = [];
        this.messagesContainer.innerHTML = '';
        this.addWelcomeMessage();
        this.saveMessages();
    }

    // Public API methods
    setUsername(username) {
        this.username = username;
    }

    addCustomMessage(text, sender = 'user') {
        const message = {
            id: Date.now(),
            text: text,
            sender: sender,
            timestamp: new Date(),
            username: sender === 'user' ? this.username : 'iborovi'
        };
        
        this.addMessage(message);
        this.messages.push(message);
        this.saveMessages();
    }
}

// Initialize messenger when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.messenger = new Messenger();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + M to toggle messenger
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            window.messenger.toggleCollapse();
        }
        
        // Ctrl/Cmd + Shift + C to clear chat
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            if (confirm('Очистить чат?')) {
                window.messenger.clearMessages();
            }
        }
    });
});

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Messenger;
}

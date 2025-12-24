document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userIdElement = document.getElementById('user-id');
    const messageElement = document.getElementById('message');
    const dateElement = document.getElementById('date');
    const counterElement = document.getElementById('counter');
    const timerElement = document.getElementById('timer');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsContent = document.getElementById('settings-content');
    const saveSettingsBtn = document.getElementById('save-settings');
    const customUserIdInput = document.getElementById('custom-user-id');

    // Default messages (6 predefined messages)
    const defaultMessages = [
        "Nhebek barcha",
        "Thinking of you always",
        "You make every day better",
        "Can't wait to see you",
        "You're my favorite person",
        "Love you endlessly"
    ];

    // State
    let messages = [...defaultMessages];
    let currentDay = 0;
    let lastUpdate = null;
    let timerInterval = null;
    let userId = "TAMTOUMTK3";

    // Initialize
    function init() {
        loadFromLocalStorage();
        updateDisplay();
        startTimer();
        setupEventListeners();
    }

    // Load data from localStorage
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('dailyNotesData');
        if (savedData) {
            const data = JSON.parse(savedData);
            messages = data.messages || messages;
            userId = data.userId || userId;
            lastUpdate = data.lastUpdate ? new Date(data.lastUpdate) : null;
            
            // Load custom messages into textareas
            for (let i = 0; i < 6; i++) {
                const textarea = document.getElementById(`msg${i + 1}`);
                if (textarea && messages[i]) {
                    textarea.value = messages[i];
                }
            }
            customUserIdInput.value = userId;
        }
        
        // Calculate current day based on last update
        if (lastUpdate) {
            const now = new Date();
            const diffTime = now - lastUpdate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            currentDay = diffDays % messages.length;
        }
    }

    // Save data to localStorage
    function saveToLocalStorage() {
        const data = {
            messages: messages,
            userId: userId,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('dailyNotesData', JSON.stringify(data));
    }

    // Update the display
    function updateDisplay() {
        // Update message
        messageElement.textContent = messages[currentDay];
        
        // Update date (format: DD/MM/YYYY)
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        dateElement.textContent = `${day}/${month}/${year}`;
        
        // Update counter (format: X/6)
        counterElement.textContent = `${currentDay + 1}/${messages.length}`;
        
        // Update user ID
        userIdElement.textContent = `FOR ${userId}`;
        
        // Save state
        saveToLocalStorage();
    }

    // Start the 24-hour countdown timer
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        function updateTimer() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const diff = tomorrow - now;
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')} : ` +
                `${minutes.toString().padStart(2, '0')} : ` +
                `${seconds.toString().padStart(2, '0')}`;
            
            // Check if it's past midnight (new day)
            if (hours === 23 && minutes === 59 && seconds === 59) {
                setTimeout(() => {
                    currentDay = (currentDay + 1) % messages.length;
                    updateDisplay();
                }, 1000);
            }
        }
        
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Settings toggle
        settingsToggle.addEventListener('click', function() {
            const isVisible = settingsContent.style.display === 'block';
            settingsContent.style.display = isVisible ? 'none' : 'block';
        });

        // Save settings
        saveSettingsBtn.addEventListener('click', function() {
            // Update messages from textareas
            for (let i = 0; i < 6; i++) {
                const textarea = document.getElementById(`msg${i + 1}`);
                if (textarea) {
                    messages[i] = textarea.value.trim() || defaultMessages[i];
                }
            }
            
            // Update user ID
            userId = customUserIdInput.value.trim() || "TAMTOUMTK3";
            
            // Update display
            updateDisplay();
            
            // Hide settings
            settingsContent.style.display = 'none';
            
            alert('Settings saved!');
        });

        // Close settings when clicking outside
        document.addEventListener('click', function(event) {
            if (!settingsContent.contains(event.target) && 
                !settingsToggle.contains(event.target) &&
                settingsContent.style.display === 'block') {
                settingsContent.style.display = 'none';
            }
        });
    }

    // Start the application
    init();
});

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const noteText = document.getElementById('note-text');
    const noteDate = document.getElementById('note-date');
    const timerElement = document.getElementById('timer');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const noteCard = document.getElementById('note-card');
    const currentNoteSpan = document.getElementById('current-note');
    const totalNotesSpan = document.getElementById('total-notes');
    const userIdElement = document.querySelector('.user-id');
    
    // Setup Modal Elements
    const setupModal = document.getElementById('setup-modal');
    const setupUserId = document.getElementById('setup-user-id');
    const noteInputs = [
        document.getElementById('note1'),
        document.getElementById('note2'),
        document.getElementById('note3'),
        document.getElementById('note4'),
        document.getElementById('note5'),
        document.getElementById('note6')
    ];
    const startDateInput = document.getElementById('start-date');
    const saveSetupBtn = document.getElementById('save-setup');
    const loadDefaultBtn = document.getElementById('load-default');

    // Default messages (6 predefined notes)
    const defaultMessages = [
        "Good morning! Today is a fresh start. What will you make of it?",
        "Remember: Progress, not perfection. Small steps lead to big changes.",
        "Take a moment to breathe. You're doing better than you think.",
        "Today's challenge: Do one thing that scares you a little.",
        "You are capable of amazing things. Believe in yourself today.",
        "Reflection: What's one thing you're grateful for right now?"
    ];

    // State
    let messages = [...defaultMessages];
    let currentIndex = 0;
    let favorites = new Set();
    let userData = null;
    let startDate = null;
    let timerInterval = null;

    // Initialize
    function init() {
        // Load saved data from localStorage
        loadSavedData();
        
        // Show setup modal if no data exists
        if (!userData) {
            setupModal.style.display = 'flex';
            // Set default start date to today
            const today = new Date().toISOString().split('T')[0];
            startDateInput.value = today;
        } else {
            setupModal.style.display = 'none';
            updateDisplay();
            startTimer();
        }
        
        totalNotesSpan.textContent = messages.length;
    }

    // Load saved data from localStorage
    function loadSavedData() {
        const savedData = localStorage.getItem('dailyNotesData');
        if (savedData) {
            userData = JSON.parse(savedData);
            messages = userData.messages || messages;
            favorites = new Set(userData.favorites || []);
            startDate = new Date(userData.startDate);
            currentIndex = calculateCurrentIndex();
            userIdElement.textContent = `FOR ${userData.userId}`;
        }
    }

    // Calculate current index based on elapsed days
    function calculateCurrentIndex() {
        if (!startDate) return 0;
        
        const now = new Date();
        const elapsedDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        return elapsedDays % messages.length;
    }

    // Update the display
    function updateDisplay() {
        noteText.textContent = messages[currentIndex];
        
        // Format date (DD / MM / YYYY)
        const today = new Date();
        const noteDateObj = new Date(startDate);
        noteDateObj.setDate(startDate.getDate() + currentIndex);
        
        const day = noteDateObj.getDate().toString().padStart(2, '0');
        const month = (noteDateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = noteDateObj.getFullYear();
        noteDate.textContent = `${day} / ${month} / ${year}`;
        
        // Update favorite star
        const starIcon = favoriteBtn.querySelector('i');
        if (favorites.has(currentIndex)) {
            starIcon.className = 'fas fa-star';
            favoriteBtn.classList.add('active');
            noteCard.classList.add('favorited');
        } else {
            starIcon.className = 'far fa-star';
            favoriteBtn.classList.remove('active');
            noteCard.classList.remove('favorited');
        }
        
        // Update current note counter
        currentNoteSpan.textContent = currentIndex + 1;
        
        // Update navigation buttons
        prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.3';
        prevBtn.style.cursor = currentIndex > 0 ? 'pointer' : 'default';
        nextBtn.style.opacity = currentIndex < messages.length - 1 ? '1' : '0.3';
        nextBtn.style.cursor = currentIndex < messages.length - 1 ? 'pointer' : 'default';
    }

    // Start the 24-hour timer
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
        }
        
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Save data to localStorage
    function saveData() {
        userData = {
            userId: userData?.userId || setupUserId.value,
            messages: messages,
            favorites: Array.from(favorites),
            startDate: startDate?.toISOString() || new Date(startDateInput.value).toISOString()
        };
        
        localStorage.setItem('dailyNotesData', JSON.stringify(userData));
    }

    // Event Listeners
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateDisplay();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < messages.length - 1) {
            currentIndex++;
            updateDisplay();
        }
    });

    // Double-click to favorite/unfavorite
    noteCard.addEventListener('dblclick', function() {
        if (favorites.has(currentIndex)) {
            favorites.delete(currentIndex);
        } else {
            favorites.add(currentIndex);
        }
        updateDisplay();
        saveData();
    });

    // Single click on star icon
    favoriteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (favorites.has(currentIndex)) {
            favorites.delete(currentIndex);
        } else {
            favorites.add(currentIndex);
        }
        updateDisplay();
        saveData();
    });

    // Setup modal buttons
    saveSetupBtn.addEventListener('click', function() {
        const userId = setupUserId.value.trim();
        if (!userId) {
            alert('Please enter your name or ID');
            return;
        }
        
        // Collect custom messages
        const customMessages = [];
        noteInputs.forEach((input, index) => {
            const message = input.value.trim();
            customMessages.push(message || defaultMessages[index]);
        });
        
        messages = customMessages;
        startDate = new Date(startDateInput.value);
        userData = { userId, messages, favorites: [], startDate: startDate.toISOString() };
        
        saveData();
        userIdElement.textContent = `FOR ${userId}`;
        setupModal.style.display = 'none';
        
        currentIndex = calculateCurrentIndex();
        updateDisplay();
        startTimer();
        totalNotesSpan.textContent = messages.length;
    });

    loadDefaultBtn.addEventListener('click', function() {
        setupUserId.value = 'USER123';
        noteInputs.forEach((input, index) => {
            input.value = defaultMessages[index];
        });
        
        const today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
    });

    // Initialize the app
    init();

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateDisplay();
        } else if (e.key === 'ArrowRight' && currentIndex < messages.length - 1) {
            currentIndex++;
            updateDisplay();
        } else if (e.key === 'f' || e.key === 'F') {
            // Press F to favorite/unfavorite
            if (favorites.has(currentIndex)) {
                favorites.delete(currentIndex);
            } else {
                favorites.add(currentIndex);
            }
            updateDisplay();
            saveData();
        }
    });
});

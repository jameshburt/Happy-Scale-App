document.addEventListener('DOMContentLoaded', () => {
    const screens = [
        document.getElementById('screen1'),
        document.getElementById('screen2'),
        document.getElementById('screen3'),
        document.getElementById('screen4'),
        document.getElementById('screen5'),
        document.getElementById('screen6'),
        document.getElementById('screen7'),
        document.getElementById('screen8'),
        document.getElementById('screen9'),
        document.getElementById('screen10'),
        document.getElementById('screen11'),
        document.getElementById('screen12'),
        document.getElementById('screen13'),
        document.getElementById('screen14'),
        document.getElementById('screen15')
    ];

    const navLinks = document.querySelectorAll('.fixed.bottom-0 a');
    let currentScreenIndex = 0;
    let isMuted = false;

    function showScreen(index) {
        screens.forEach((screen, i) => {
            if (i === index) {
                screen.classList.remove('hidden');
            } else {
                screen.classList.add('hidden');
            }
        });
        currentScreenIndex = index;
        updateNavBar(index);
    }

    function updateNavBar(index) {
        navLinks.forEach((link, i) => {
            if (i === index) {
                link.classList.add('text-blue-500');
            } else {
                link.classList.remove('text-blue-500');
            }
        });
    }

    function validateWeightEntry(weight) {
        return /^\d+(\.\d+)?\s*(lbs|kg|stones)?$/.test(weight.trim());
    }

    function saveWeightEntry(weight, notes) {
        const entries = JSON.parse(localStorage.getItem('weightEntries')) || [];
        entries.push({ weight, notes, date: new Date().toISOString() });
        localStorage.setItem('weightEntries', JSON.stringify(entries));
        displayWeightEntries();
        showNotification('Entry saved successfully!');
        updateGoalProgress();
    }

    function displayWeightEntries() {
        const entries = JSON.parse(localStorage.getItem('weightEntries')) || [];
        const logbookScreen = document.getElementById('screen11');
        const logbookContent = logbookScreen.querySelector('p');
        if (entries.length === 0) {
            logbookContent.textContent = 'No Entries Yet';
        } else {
            logbookContent.innerHTML = entries.map((entry, index) => {
                return `<p>${entry.weight} on ${new Date(entry.date).toLocaleDateString()} - ${entry.notes} 
                        <button onclick="editEntry(${index})">Edit</button> 
                        <button onclick="deleteEntry(${index})">Delete</button></p>`;
            }).join('');
        }
    }

    function editEntry(index) {
        const entries = JSON.parse(localStorage.getItem('weightEntries'));
        const entry = entries[index];
        document.querySelector('#screen14 input[type="text"]').value = entry.weight;
        document.querySelector('#screen14 textarea').value = entry.notes;
        showScreen(14);
    }

    function deleteEntry(index) {
        let entries = JSON.parse(localStorage.getItem('weightEntries'));
        entries.splice(index, 1);
        localStorage.setItem('weightEntries', JSON.stringify(entries));
        displayWeightEntries();
        showNotification('Entry deleted successfully!');
        updateGoalProgress();
    }

    function createProfile(name, email) {
        localStorage.setItem('userProfile', JSON.stringify({ name, email }));
        alert('Profile created successfully!');
        showScreen(0);
    }

    function syncProfile(email) {
        const dummyProfile = { name: 'John Doe', email: email };
        localStorage.setItem('userProfile', JSON.stringify(dummyProfile));
        alert('Profile synced successfully!');
        showScreen(0);
    }

    function updateProfile(name, email) {
        let profile = JSON.parse(localStorage.getItem('userProfile'));
        profile.name = name;
        profile.email = email;
        localStorage.setItem('userProfile', JSON.stringify(profile));
        alert('Profile updated successfully!');
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.remove
            document.body.removeChild(notification);
        }, 3000);
    }

    function setWeightGoal(targetWeight, targetDate) {
        localStorage.setItem('weightGoal', JSON.stringify({ targetWeight, targetDate }));
        showNotification('Weight goal set successfully!');
        displayGoal();
    }

    function displayGoal() {
        const goal = JSON.parse(localStorage.getItem('weightGoal'));
        const goalContent = document.querySelector('.goal-content');
        if (goal) {
            goalContent.innerHTML = `<p>Target Weight: ${goal.targetWeight}</p>
                                     <p>Target Date: ${new Date(goal.targetDate).toLocaleDateString()}</p>`;
        } else {
            goalContent.textContent = 'No goal set.';
        }
    }

    function updateGoalProgress() {
        const goal = JSON.parse(localStorage.getItem('weightGoal'));
        const entries = JSON.parse(localStorage.getItem('weightEntries')) || [];
        if (goal && entries.length > 0) {
            const currentWeight = parseFloat(entries[entries.length - 1].weight);
            const targetWeight = parseFloat(goal.targetWeight);
            const targetDate = new Date(goal.targetDate);
            const today = new Date();
            const remainingDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
            const progress = ((targetWeight - currentWeight) / (targetWeight) * 100).toFixed(2);
            showNotification(`Progress: ${progress}% - ${remainingDays} days remaining`);
        }
    }

    // Handle initial screen navigation
    document.querySelector('#screen1 a:nth-child(2)').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(1);
    });

    document.querySelector('#screen1 a:nth-child(4)').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(2);
    });

    // Handle navigation bar clicks
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen(index);
        });
    });

    // Handle forward button clicks
    document.querySelectorAll('.fa-arrow-right').forEach((button, index) => {
        button.addEventListener('click', () => {
            showScreen((currentScreenIndex + 1) % screens.length);
        });
    });

    // Handle mute/unmute buttons
    document.querySelectorAll('.fa-volume-mute').forEach(button => {
        button.addEventListener('click', () => {
            isMuted = !isMuted;
            button.classList.toggle('fa-volume-mute');
            button.classList.toggle('fa-volume-up');
            if (isMuted) {
                alert('Sounds muted');
            } else {
                alert('Sounds unmuted');
            }
        });
    });

    // Handle add entry in log weight screen
    document.querySelector('#screen14 button').addEventListener('click', () => {
        const weight = document.querySelector('#screen14 input[type="text"]').value;
        const notes = document.querySelector('#screen14 textarea').value;
        if (!validateWeightEntry(weight)) {
            alert('Please enter a valid weight');
            return;
        }
        saveWeightEntry(weight, notes);
        showScreen(14);
    });

    // Handle done button in log weight confirmation screen
    document.querySelector('#screen15 button').addEventListener('click', () => {
        const weight = document.querySelector('#screen15 input[type="text"]').value;
        const notes = document.querySelector('#screen15 textarea').value;
        if (!validateWeightEntry(weight)) {
            alert('Please enter a valid weight');
            return;
        }
        saveWeightEntry(weight, notes);
        showNotification(`Weight: ${weight}\nNotes: ${notes}`);
        displayWeightEntries();
        showScreen(14);
    });

    // Handle profile creation
    document.querySelector('#screen1 a:nth-child(2)').addEventListener('click', (e) => {
        e.preventDefault();
        const name = prompt('Enter your name:');
        const email = prompt('Enter your email:');
        if (name && email) {
            createProfile(name, email);
        }
    });

    // Handle profile syncing
    document.querySelector('#screen1 a:nth-child(4)').addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Enter your email to sync profile:');
        if (email) {
            syncProfile(email);
        }
    });

    // Handle profile updates
    document.querySelectorAll('#screen12 .fa-arrow-right').forEach((arrow, index) => {
        arrow.addEventListener('click', () => {
            const name = prompt('Update your name:');
            const email = prompt('Update your email:');
            if (name && email) {
                updateProfile(name, email);
            }
        });
    });

    // Handle settings toggles
    document.querySelectorAll('#screen12 .fa-arrow-right').forEach((arrow, index) => {
        arrow.addEventListener('click', () => {
            alert(`Setting ${index + 1} clicked`);
        });
    });

    // Handle setting weight goals
    document.querySelector('#set-goal-btn').addEventListener('click', () => {
        const targetWeight = prompt('Enter your target weight:');
        const targetDate = prompt('Enter your target date (YYYY-MM-DD):');
        if (targetWeight && targetDate) {
            setWeightGoal(targetWeight, targetDate);
        }
    });

    // Show the initial screen
    showScreen(currentScreenIndex);
    displayWeightEntries();
    displayGoal();
});

// Expose global functions for editing and deleting entries
window.editEntry = editEntry;
window.deleteEntry = deleteEntry;


const API_BASE = window.location.origin.startsWith('http://localhost:5000') 
    ? ''  
    : 'http://localhost:5000';
document.getElementById('generateBtn').addEventListener('click', async function() {
    const btn = document.getElementById('generateBtn'); // Explicitly get button
    const topic = document.getElementById('topicInput').value.trim();
    const stance = document.getElementById('stanceSelect').value;
    
    if (!topic) {
        alert('Please enter a debate topic');
        return;
    }
    btn.innerHTML = '<span class="spinner">⚙️</span> Thinking...';
    btn.disabled = true;
    
    try {
        const response = await fetch('http://localhost:5000/get_arguments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: topic.toLowerCase().replace(/\s+/g, '_'),
                stance: stance
            })
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Server error');
        }
        
        const data = await response.json();
        displayArguments(data.arguments);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        btn.textContent = 'Generate Arguments';
        btn.disabled = false;
    }
});

function displayArguments(arguments) {
    const output = document.getElementById('argumentsOutput');
    output.innerHTML = arguments.map(arg => 
        `<div class="argument-item">${arg}</div>`
    ).join('');
}













document.querySelector('.results').classList.add('visible');

function displayArguments(arguments) {
    const output = document.getElementById('argumentsOutput');
    output.innerHTML = '';
    arguments.forEach((arg, index) => {
        const argElement = document.createElement('div');
        argElement.className = 'argument-item';
        argElement.textContent = arg;
        argElement.style.animationDelay = `${index * 0.1}s`;
        output.appendChild(argElement);
    });
}




















// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});

// Modify your existing displayArguments function to add the visible class
function displayArguments(arguments) {
    const output = document.getElementById('argumentsOutput');
    const results = document.querySelector('.results');
    
    results.classList.add('visible');
    output.innerHTML = '';
    
    arguments.forEach((arg, index) => {
        const argElement = document.createElement('div');
        argElement.className = 'argument-item';
        argElement.textContent = arg;
        argElement.style.animationDelay = `${index * 0.1}s`;
        output.appendChild(argElement);
    });
}






// Notes functionality
const addNoteBtn = document.getElementById('addNoteBtn');
const notesArea = document.getElementById('notesArea');
let notes = JSON.parse(localStorage.getItem('debate-notes')) || [];

// Toggle notes area visibility
addNoteBtn.addEventListener('click', () => {
    notesArea.classList.toggle('visible');
    
    if (notesArea.classList.contains('visible')) {
        renderNotes();
    }
});

// Render all saved notes
function renderNotes() {
    notesArea.innerHTML = `
        <div class="note-input-container">
            <textarea class="note-input" placeholder="Add your note here..." rows="3"></textarea>
            <button class="note-btn" id="saveNoteBtn">Save Note</button>
        </div>
        ${notes.map((note, index) => `
            <div class="note" data-index="${index}">
                <div class="note-text">${note}</div>
                <button class="delete-note">✕</button>
            </div>
        `).join('')}
    `;
    
    // Add event listener for new save button
    document.getElementById('saveNoteBtn')?.addEventListener('click', saveNote);
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-note').forEach(btn => {
        btn.addEventListener('click', deleteNote);
    });
}

// Save a new note
function saveNote() {
    const noteInput = document.querySelector('.note-input');
    const noteText = noteInput.value.trim();
    
    if (noteText) {
        notes.push(noteText);
        localStorage.setItem('debate-notes', JSON.stringify(notes));
        noteInput.value = '';
        renderNotes();
        
        // Add a nice animation to the new note
        const lastNote = document.querySelector('.note:last-child');
        if (lastNote) {
            lastNote.style.animation = 'slideIn 0.3s ease-out';
        }
    }
}

// Delete a note
function deleteNote(e) {
    const noteElement = e.target.closest('.note');
    const index = noteElement.dataset.index;
    
    // Add delete animation
    noteElement.style.animation = 'fadeOut 0.3s ease-out forwards';
    
    setTimeout(() => {
        notes.splice(index, 1);
        localStorage.setItem('debate-notes', JSON.stringify(notes));
        renderNotes();
    }, 300);
}



































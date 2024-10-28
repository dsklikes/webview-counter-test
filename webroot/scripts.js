let count = 0;
const counter = document.getElementById('counter');
const button = document.getElementById('clickButton');
const clickersList = document.getElementById('clickersList');

// Mock usernames for demonstration
const mockUsernames = [
    'RedditUser123', 'Snoo_Fan', 'KarmaCollector', 'UpvoteChamp',
    'AwardGiver', 'MemeQueen', 'RedditExplorer', 'SubHunter'
];

// Store recent clicks
const recentClicks = [];
const MAX_RECENT_CLICKS = 5;

// Initialize the counter with any existing state
window.onmessage = (ev) => {
    console.log('state: ', ev.data);
    if (ev.data.type === 'state') {
        count = ev.data.data.count || 0;
        if (ev.data.data.recentClicks) {
            recentClicks.push(...ev.data.data.recentClicks);
            updateRecentClickers();
        }
        updateDisplay();
    }
};

function updateDisplay() {
    console.log('log test in updateDisplay');
    counter.textContent = count;
    counter.style.transform = 'scale(1.1)';
    setTimeout(() => {
        counter.style.transform = 'scale(1)';
    }, 100);
}

function formatTimestamp(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function updateRecentClickers() {
    // Clear existing items
    clickersList.innerHTML = '';
    
    // Add actual clicks
    recentClicks.slice(0, MAX_RECENT_CLICKS).forEach(click => {
        const clickerItem = document.createElement('div');
        clickerItem.className = 'clicker-item';
        clickerItem.innerHTML = `
            <span class="username">${click.username}</span>
            <span class="timestamp">${formatTimestamp(click.timestamp)}</span>
        `;
        clickersList.appendChild(clickerItem);
    });
    
    // Add placeholder items if needed
    const remainingSlots = MAX_RECENT_CLICKS - recentClicks.length;
    for (let i = 0; i < remainingSlots; i++) {
        const placeholder = document.createElement('div');
        placeholder.className = 'clicker-item placeholder';
        clickersList.appendChild(placeholder);
    }
}

function handleClick() {
    console.log('log test in handleClick');
    count++;
    // Add new click with random username
    const newClick = {
        username: mockUsernames[Math.floor(Math.random() * mockUsernames.length)],
        timestamp: new Date()
    };
    recentClicks.unshift(newClick);
    if (recentClicks.length > MAX_RECENT_CLICKS) {
        recentClicks.pop();
    }
    
    updateDisplay();
    updateRecentClickers();
    
    // Send the updated state to the parent
    window.parent.postMessage(
        {
            type: 'counterUpdate',
            data: {
                count: count,
                recentClicks: recentClicks
            }
        },
        "*"
    );
}

// Fix: Properly add the click event listener
document.addEventListener('DOMContentLoaded', () => {
    button.addEventListener('click', handleClick);
});

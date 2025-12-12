// Notifications
function showNotification(message, type = 'default') {
    const notif = document.getElementById('notification');
    notif.innerText = message;
    notif.className = `notification show ${type}`;
    setTimeout(() => notif.classList.remove('show', 'success', 'error'), 3000);
}

// Clock
function updateTime() {
    document.getElementById('currentTime').innerText = new Date().toLocaleString();
}

// Global state for security checks
let lastVerifiedGuardian = null;
let lastVerifiedChildrenMap = {};

// Fetch pickups and update dashboard table/stats
async function fetchPickups() {
    try {
        const response = await fetch('/api/pickups');
        const pickups = await response.json();

        document.getElementById('totalPickups').innerText = pickups.length;
        const unauthorized = pickups.filter(p => p.status && (p.status === 'UNAUTHORIZED' || p.status === 'ABSENT_BLOCK')).length;
        const pending = pickups.filter(p => p.status && p.status === 'PENDING').length;

        document.getElementById('unauthPickups').innerText = unauthorized;
        document.getElementById('pendingPickups').innerText = pending;

        // Update pickup table
        const tableBody = document.getElementById('pickupTable');
        tableBody.innerHTML = '';

        pickups.forEach(p => {
            const row = document.createElement('tr');

            let displayStatus = p.status;
            let statusClass = '';

            // Mapping server statuses to display statuses
            if (p.status === 'PICKED_UP' || p.status === 'AUTHORIZED') {
                statusClass = 'authorized';
                displayStatus = 'AUTHORIZED';
            } else if (p.status === 'ABSENT_BLOCK') {
                statusClass = 'unauthorized';
                displayStatus = 'ABSENT';
            } else if (p.status === 'UNAUTHORIZED') {
                statusClass = 'unauthorized';
                displayStatus = 'UNAUTHORIZED';
            }
            row.classList.add(statusClass);

            const studentDisplay = (p.status === 'UNAUTHORIZED' || !p.studentName || p.studentName === '-') ? '-' : p.studentName;

            const displayName = p.guardianName || 'Unknown'; // now uses backend name for both authorized & unauthorized


            row.innerHTML = `
                <td>${displayName}</td>
                <td>${p.parentIC || '-'}</td> 
                <td>${studentDisplay}</td>
                <td>${new Date(p.timestamp).toLocaleString()}</td>
                <td>${displayStatus || '-'}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching pickups:', error);
        showNotification('Error fetching pickup data', 'error');
    }
}

// Show children checkboxes in modal
function showChildrenCheckboxes(children) {
    const container = document.getElementById('childrenCheckboxes');
    container.innerHTML = '';
    lastVerifiedChildrenMap = {};

    children.forEach((child) => {
        const childName = child.name;
        const childId = child.id;

        if (!childName) {
            console.error("Child object missing 'name' property:", child);
            return;
        }

        lastVerifiedChildrenMap[childName] = childId;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `child-${childId}`;
        checkbox.value = childName;

        // If attendance is not PRESENT, disable the checkbox
        if (child.attendance && child.attendance !== 'PRESENT') {
            checkbox.checked = false;
            checkbox.disabled = true;
            checkbox.style.cursor = 'not-allowed'; // show not-allowed cursor on checkbox
        } else {
            checkbox.checked = true;
        }

        const label = document.createElement('label');
        label.htmlFor = `child-${childId}`;
        const statusText = child.status && child.status !== 'PRESENT' ? ` (${child.status})` : '';
        label.innerText = childName + statusText;

        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);

        container.appendChild(div);
    });

    document.getElementById('childrenModal').style.display = 'block';
}


// Close modal
function closeModal() {
    document.getElementById('childrenModal').style.display = 'none';
}

// Simulate NFC scan / verify parent
async function simulateScan() {
    const icNumber = document.getElementById('icInput').value.trim();
    if (!icNumber) {
        showNotification('Please enter an IC number', 'error');
        return;
    }

    try {
        const response = await fetch('/api/guardians/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `icNumber=${encodeURIComponent(icNumber)}`
        });

        const result = await response.json();

        closeModal();
        lastVerifiedGuardian = null;

        if (result.status === 'success') {
            lastVerifiedGuardian = { ...result, icNumber: icNumber };

            if (result.children && result.children.length > 0) {
                showChildrenCheckboxes(result.children);
                showNotification(`Guardian verified. Select children for pickup.`, 'success');
            } else {
                showNotification(`Guardian verified, but no children linked.`, 'default');
            }
        } else {
            showNotification(`Unauthorized attempt: IC ${icNumber}`, 'error');
        }

        fetchPickups();

    } catch (error) {
        console.error('Error verifying parent:', error);
        showNotification('Error connecting to server', 'error');
    }
}

async function confirmPickup() {
    if (!lastVerifiedGuardian || !lastVerifiedGuardian.icNumber) {
        showNotification('No verified parent or IC data to confirm.', 'error');
        return;
    }

    const icNumber = lastVerifiedGuardian.icNumber;
    const checkboxes = document.querySelectorAll('#childrenCheckboxes input[type=checkbox]');

    const selectedChildrenNames = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedChildrenNames.length === 0) {
        showNotification('No children selected for pickup.', 'error');
        return;
    }

    // Loop through selected children and perform the final security verification
    for (const childName of selectedChildrenNames) {
        const studentId = lastVerifiedChildrenMap[childName];

        if (!studentId) {
            showNotification(`Error: Cannot find ID for ${childName}.`, 'error');
            continue;
        }

        try {
            const response = await fetch(`/api/pickups/confirm?studentId=${studentId}&guardianIc=${icNumber}`, {
                method: 'POST'
            });

            const statusResult = await response.text();

            if (statusResult === 'AUTHORIZED') {
                showNotification(`Pickup confirmed for ${childName}`, 'success');
            }
            else if (statusResult === 'ABSENT_BLOCKED') {
                showNotification(`BLOCKED: ${childName} is ABSENT!`, 'error');
            }
            else {
                showNotification(`Pickup denied for ${childName}. Status: ${statusResult}`, 'error');
            }

        } catch (error) {
            console.error("Error confirming pickup:", error);
            showNotification("Server error during verification", 'error');
        }
    }

    lastVerifiedGuardian = null;
    closeModal();

    fetchPickups();
}

// Initial load
updateTime();
setInterval(updateTime, 1000);
document.addEventListener('DOMContentLoaded', fetchPickups);
setInterval(fetchPickups, 5000);
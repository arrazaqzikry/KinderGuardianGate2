// Notifications
function showNotification(message) {
    const notif = document.getElementById('notification');
    notif.innerText = message;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

// Clock
function updateTime() {
    document.getElementById('currentTime').innerText = new Date().toLocaleString();
}

// Fetch pickups and update dashboard table/stats
async function fetchPickups() {
    try {
        const response = await fetch('/api/pickups');
        const pickups = await response.json();

        // Stats
        document.getElementById('totalPickups').innerText = pickups.length;
        const unauthorized = pickups.filter(p => p.status === 'UNAUTHORIZED').length;
        const pending = pickups.filter(p => p.status === 'PENDING').length;
        document.getElementById('unauthPickups').innerText = unauthorized;
        document.getElementById('pendingPickups').innerText = pending;

        // Update pickup table
        const tableBody = document.getElementById('pickupTable');
        tableBody.innerHTML = '';
        pickups.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.guardianName}</td>
                <td>${p.studentName}</td>
                <td>${new Date(p.timestamp).toLocaleString()}</td>
                <td>${p.status}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching pickups:', error);
        showNotification('Error fetching pickup data');
    }
}

// Show children checkboxes in modal (even for single child)
function showChildrenCheckboxes(children) {
    const container = document.getElementById('childrenCheckboxes');
    container.innerHTML = '';

    children.forEach((child, idx) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `child-${idx}`;
        checkbox.value = child;
        checkbox.checked = true;

        const label = document.createElement('label');
        label.htmlFor = `child-${idx}`;
        label.innerText = child;

        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);

        container.appendChild(div);
    });

    // Show modal
    document.getElementById('childrenModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('childrenModal').style.display = 'none';
}

// Temporary store last verified guardian
let lastVerifiedGuardian = null;

// Simulate NFC scan / verify parent
async function simulateScan() {
    const icNumber = document.getElementById('icInput').value.trim(); // changed input ID
    if (!icNumber) {
        showNotification('Please enter an IC number');
        return;
    }

    try {
        const response = await fetch('/api/guardians/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `icNumber=${encodeURIComponent(icNumber)}` // send IC instead of name
        });

        const result = await response.json();

        // Close any previous modal
        closeModal();

        if (result.status === 'success') {
            lastVerifiedGuardian = result;
            if (result.children.length > 0) {
                showChildrenCheckboxes(result.children); // modal popup
                showNotification(`Select children for pickup.`);
            } else {
                // No children, still authorized
                addPickupToTable(result.guardianName, '-', 'AUTHORIZED');
                showNotification(`Pickup authorized for ${result.guardianName}. No children.`);
            }
        } else {
            // Unauthorized attempt
            lastVerifiedGuardian = null;
            addPickupToTable(icNumber, '-', 'UNAUTHORIZED'); // show IC in table
            showNotification(`Unauthorized pickup attempt for IC: ${icNumber}`);
        }

        // Refresh stats and table
        fetchPickups();

    } catch (error) {
        console.error('Error verifying parent:', error);
        showNotification('Error connecting to server');
    }
}


// Confirm selected children and mark as picked
function confirmPickup() {
    if (!lastVerifiedGuardian) {
        showNotification('No verified parent to confirm.');
        return;
    }

    const checkboxes = document.querySelectorAll('#childrenCheckboxes input[type=checkbox]');
    const selectedChildren = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedChildren.length === 0) {
        showNotification('No children selected for pickup.');
        return;
    }

    selectedChildren.forEach(childName => {
        addPickupToTable(lastVerifiedGuardian.guardianName, childName, 'AUTHORIZED');
    });

    // Clear and close modal
    lastVerifiedGuardian = null;
    closeModal();
    showNotification('Pickup confirmed.');

    // Refresh stats and table
    fetchPickups();
}

// Add pickup row to table
function addPickupToTable(parentName, childName, status) {
    const tableBody = document.getElementById('pickupTable');
    const timestamp = new Date().toISOString();
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${parentName}</td>
        <td>${childName}</td>
        <td>${new Date(timestamp).toLocaleString()}</td>
        <td>${status}</td>
    `;
    tableBody.appendChild(row);
}

// Initial load
updateTime();
setInterval(updateTime, 1000);
fetchPickups();
setInterval(fetchPickups, 5000);
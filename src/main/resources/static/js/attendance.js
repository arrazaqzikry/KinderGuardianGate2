const API_URL = '/api/attendance';
const tableBody = document.getElementById('attendanceTableBody');

let isEditable = true;

/* ---------------------------
   LOAD ATTENDANCE DATA
---------------------------- */
async function loadAttendanceTable() {
    try {
        const response = await fetch(`${API_URL}/today`);
        if (!response.ok) throw new Error('Failed to fetch attendance data');

        const students = await response.json();

        const wasSubmitted = students.some(
            s => s.status === 'PRESENT' || s.status === 'ABSENT'
        );

        renderAttendanceTable(students, wasSubmitted);

    } catch (error) {
        console.error("Error loading attendance:", error);
        showAlert("Error", "Failed to load attendance list.");
    }
}

/* ---------------------------
   UPDATE BUTTON STATES
---------------------------- */
function updateControlButtons(wasSubmitted) {
    const submitBtn = document.getElementById('submitAttendanceBtn');
    const editBtn = document.getElementById('editAttendanceBtn');

    if (wasSubmitted) {
        isEditable = false;
        submitBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
    } else {
        isEditable = true;
        submitBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
    }
}

/* ---------------------------
   ENABLE EDIT MODE
---------------------------- */
window.enableEditing = function () {
    isEditable = true;
    updateControlButtons(false);

    tableBody.querySelectorAll('tr').forEach(row => {
        row.classList.remove('status-present', 'status-absent');
    });

    tableBody.querySelectorAll('input[type="radio"]').forEach(r => {
        r.disabled = false;
    });
};

/* ---------------------------
   RENDER TABLE
---------------------------- */
function renderAttendanceTable(students, wasSubmitted) {
    tableBody.innerHTML = '';

    updateControlButtons(wasSubmitted);

    if (students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No student records found.</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = tableBody.insertRow();
        row.dataset.studentId = student.id;

        row.insertCell().textContent = student.id;
        row.insertCell().textContent = student.name;

        const statusLabel = student.status ? student.status.toUpperCase() : '';
        const isDisabled = wasSubmitted && !isEditable ? 'disabled' : '';

        if (wasSubmitted && !isEditable) {
            if (statusLabel === 'PRESENT') row.classList.add('status-present');
            else if (statusLabel === 'ABSENT') row.classList.add('status-absent');
        }

        row.insertCell().innerHTML = `
            <input type="radio" name="status_${student.id}" value="PRESENT"
            ${statusLabel === 'PRESENT' ? 'checked' : ''} ${isDisabled}>
        `;

        row.insertCell().innerHTML = `
            <input type="radio" name="status_${student.id}" value="ABSENT"
            ${statusLabel === 'PRESENT' ? '' : 'checked'} ${isDisabled}>
        `;
    });
}

/* ---------------------------
   SAVE ATTENDANCE
---------------------------- */
async function saveAttendance() {

    if (!isEditable) {
        showAlert("Locked", "Click 'Edit Attendance' before updating.");
        return;
    }

    const attendanceData = [];

    tableBody.querySelectorAll('tr').forEach(row => {
        const studentId = row.dataset.studentId;
        const selected = row.querySelector(`input[name="status_${studentId}"]:checked`);

        if (selected) {
            attendanceData.push({
                studentId: parseInt(studentId),
                status: selected.value
            });
        }
    });

    if (attendanceData.length === 0) {
        showAlert("Warning", "Please select attendance before submitting.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
        });

        if (response.ok) {
            showModal();  // SUCCESS POPUP
            loadAttendanceTable();
        } else {
            showAlert("Error", "Failed to save attendance.");
        }

    } catch (err) {
        console.error(err);
        showAlert("Error", "Submission error occurred.");
    }
}

window.saveAttendance = saveAttendance;

/* ---------------------------
   AUTO LOAD
---------------------------- */
document.addEventListener('DOMContentLoaded', loadAttendanceTable);

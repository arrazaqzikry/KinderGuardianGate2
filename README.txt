KinderGuardianGate is a web-based application designed to manage student pick-ups securely in kindergartens.
It allows staff to verify guardians, track student pick-ups, and monitor unauthorized access attempts.

---
## How to Use the Application
### 1. Accessing the App
- Open your browser and go to:

http://localhost:8080
- Make sure the backend Spring Boot application is running.
- Optional: H2 Database Console for checking data:
JDBC URL: `jdbc:h2:mem:kinderguardiangate`
Username: `sa`
Password: *(leave blank)*

### 2. Guardian Verification
- Enter the **IC number** of the guardian in the input field to simulate the NFC Reader tapping process.
- Click **Verify**.
- If the guardian exists:
  - A list of their children appears.
  - Select the children for pick-up.
  - Click **Confirm Pickup** to finalize.
- If the guardian does **not exist**: (In this prototype, we use mock user as unauthorised guardian, which is 12345, 12346, 12347, 12348, 12349)
  - The system automatically logs the attempt as **Unauthorized**.
  - A name for the unauthorized guardian will appear in the log.

### 3. Pick-up Logging
- Every verification attempt is logged in the system.
- Each log includes:
  - Guardian Name (if registered)
  - Guardian IC
  - Children Name (if selected)
  - Timestamp
  - Status: AUTHORIZED, UNAUTHORIZED, ABSENT_BLOCK

### 4. Dashboard Overview
- **Total Pickups:** Shows the total number of pick-up attempts.
- **Unauthorized Pickups:** Counts all unauthorized or blocked attempts.
- **Pending Pickups:** Counts all pick-ups that are pending verification.
- **Pickup Table:** Displays a detailed list of logs including:
  - Guardian/People name
  - Student name
  - Timestamp
  - Status

The dashboard updates automatically every 5 seconds.

---

### 5. Managing Students
- Navigate to the **Students** section.
- You can:
  - **Add a student:** Fill in name and optional photo URL.
  - **Edit a student:** Update the student’s details.
  - **Delete a student:** Remove a student from the system.
- Assign students to guardians by editing the guardian and selecting the corresponding students.

### 6. Notifications
- System notifications appear on the top of the page for:
  - Successful verification
  - Unauthorized attempts
  - Errors or server issues
- Notifications disappear automatically after a few seconds.

### 7. Security
- Only verified guardians can pick up students.
- Unauthorized attempts are logged immediately with a fallback name.
- The system prevents pick-ups if no children are selected.

---
## Quick Tips
- Ensure that the backend is running before using the frontend.
- Always check the **children selection modal** before confirming a pick-up.
- Unauthorized attempts are saved immediately, so staff can monitor suspicious activities.
---
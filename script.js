const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const yearInput = document.getElementById("year");

const studentTableBody = document.getElementById("studentTableBody");
const studentCount = document.getElementById("studentCount");
const searchInput = document.getElementById("searchInput");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

let students = [];
let editingId = null;


// Load students when page opens
loadStudents();


// GET - Fetch students
async function loadStudents() {
    try {
        const response = await fetch("/api/students");
        students = await response.json();

        displayStudents(students);
    } catch (error) {
        console.error("Error loading students:", error);
    }
}


// Display students
function displayStudents(studentList) {

    studentTableBody.innerHTML = "";

    studentCount.textContent = `${studentList.length} student(s)`;

    if (studentList.length === 0) {
        document.getElementById("emptyMessage").hidden = false;
        return;
    }

    document.getElementById("emptyMessage").hidden = true;

    studentList.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.department}</td>
            <td>${student.year}${getYearSuffix(student.year)}</td>
            <td>
                <button class="edit-btn" onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });
}


// Add or Update student
studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const studentData = {
        name: nameInput.value.trim(),
        department: departmentInput.value,
        year: Number(yearInput.value)
    };

    try {

        if (editingId === null) {

            // CREATE
            const response = await fetch("/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Student added successfully!");

        } else {

            // UPDATE
            const response = await fetch(`/api/students/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Student updated successfully!");

            editingId = null;

            submitButton.textContent = "Add Student";
            cancelButton.hidden = true;
        }

        studentForm.reset();

        loadStudents();

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong.");
    }
});


// Edit student
function editStudent(id) {

    const student = students.find(student => student.id === id);

    if (!student) return;

    editingId = id;

    nameInput.value = student.name;
    departmentInput.value = student.department;
    yearInput.value = student.year;

    submitButton.textContent = "Update Student";
    cancelButton.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Cancel edit
cancelButton.addEventListener("click", function() {

    editingId = null;

    studentForm.reset();

    submitButton.textContent = "Add Student";
    cancelButton.hidden = true;
});


// Delete student
async function deleteStudent(id) {

    const student = students.find(student => student.id === id);

    if (!student) return;

    const confirmed = confirm(
        `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) return;

    try {

        const response = await fetch(`/api/students/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Student deleted successfully!");

        loadStudents();

    } catch (error) {
        console.error("Error deleting student:", error);
    }
}


// Search students
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText) ||
        student.department.toLowerCase().includes(searchText)
    );

    displayStudents(filteredStudents);
});


// Year suffix
function getYearSuffix(year) {

    if (year == 1) return "st Year";
    if (year == 2) return "nd Year";
    if (year == 3) return "rd Year";
    return "th Year";
}
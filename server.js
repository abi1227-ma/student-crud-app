const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Temporary student data
let students = [
    {
        id: 1,
        name: "Abilaksha",
        department: "CSE",
        year: 3
    },
    {
        id: 2,
        name: "Rithick",
        department: "CSE",
        year: 3
    }
];

// GET - Read all students
app.get("/api/students", (req, res) => {
    res.json(students);
});

// POST - Create a new student
app.post("/api/students", (req, res) => {
    const { name, department, year } = req.body;

    if (!name || !department || !year) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newStudent = {
        id: students.length > 0
            ? Math.max(...students.map(student => student.id)) + 1
            : 1,
        name,
        department,
        year
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

// PUT - Update a student
app.put("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const student = students.find(student => student.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, department, year } = req.body;

    student.name = name || student.name;
    student.department = department || student.department;
    student.year = year || student.year;

    res.json({
        message: "Student updated successfully",
        student
    });
});

// DELETE - Delete a student
app.delete("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const studentExists = students.some(student => student.id === id);

    if (!studentExists) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students = students.filter(student => student.id !== id);

    res.json({
        message: "Student deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
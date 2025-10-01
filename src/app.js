const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mock residents (simplified from your prototype)
const residents = [
  {
    id: "1",
    name: "Margaret Thompson",
    room: "101A",
    age: 82,
    status: "stable",
    summary: ["Last meal ✓", "Medications up to date", "Mood: Content"],
  },
  {
    id: "2",
    name: "Robert Johnson",
    room: "102B",
    age: 78,
    status: "attention",
    summary: ["Missed breakfast", "Meds due in 1 hr", "Mood: Restless"],
  },
  {
    id: "3",
    name: "Juanita Dela Cruz",
    room: "103A",
    age: 85,
    status: "urgent",
    summary: ["Vitals elevated", "Medication overdue", "Mood: Anxious"],
  },
];

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET all residents
app.get('/residents', (req, res) => {
  res.json(residents);
});

// GET a single resident by ID
app.get('/residents/:id', (req, res) => {
  const resident = residents.find(r => r.id === req.params.id);
  if (!resident) return res.status(404).json({ error: 'Resident not found' });
  res.json(resident);
});

// POST new resident
app.post('/residents', (req, res) => {
  const { name, room, age, status } = req.body || {};
  if (!name || !room || !age) {
    return res.status(400).json({ error: 'name, room, and age required' });
  }
  const newResident = {
    id: (residents.length + 1).toString(),
    name,
    room,
    age,
    status: status || "stable",
    summary: [],
  };
  residents.push(newResident);
  res.status(201).json(newResident);
});

module.exports = app;

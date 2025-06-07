// src/App.js
import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import './index.css';

function App() {
  const [task, setTask] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!task || !remindAt || !contact) {
      setStatus("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "reminders"), {
        task,
        remindAt: Timestamp.fromDate(new Date(remindAt)),
        contact,
        sent: false,
      });
      setStatus("Reminder saved!");
      setTask("");
      setRemindAt("");
      setContact("");
    } catch (error) {
      console.error("Error adding reminder: ", error);
      setStatus("Failed to save reminder.");
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-10 bg-white rounded shadow">
      <h1 className="text-2xl mb-4 font-bold">Add a Reminder</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Task</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What do you want to be reminded of?"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Remind At</label>
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Contact (Email or Phone)</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="email@example.com or +123456789"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Reminder
        </button>
      </form>
      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}

export default App;

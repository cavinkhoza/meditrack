// Enhanced data structures
let symptoms = [
  { 
    id: 1, 
    symptom: "Headache", 
    severity: 6, 
    duration: "2-4 hours",
    notes: "Throbbing pain in temples, worsens with light", 
    date: "2024-06-20",
    time: "14:30" 
  },
  { 
    id: 2, 
    symptom: "Fever", 
    severity: 8, 
    duration: "1-2 days",
    notes: "Temperature 101.5°F, body aches", 
    date: "2024-06-22",
    time: "08:15" 
  }
];

let appointments = [
  { 
    id: 1, 
    doctor: "Dr. Sarah Johnson", 
    specialty: "Cardiology",
    date: "2024-06-28", 
    time: "10:00", 
    reason: "Annual cardiac checkup",
    status: "Confirmed" 
  },
  { 
    id: 2, 
    doctor: "Dr. Michael Chen", 
    specialty: "General Medicine",
    date: "2024-07-02", 
    time: "14:00", 
    reason: "Follow-up consultation",
    status: "Pending" 
  }
];

const doctors = {
  "General Medicine": [
    "Dr. Michael Chen",
    "Dr. Lisa Rodriguez",
    "Dr. James Wilson"
  ],
  "Cardiology": [
    "Dr. Sarah Johnson",
    "Dr. Robert Kim",
    "Dr. Maria Santos"
  ],
  "Dermatology": [
    "Dr. Emily Davis",
    "Dr. Andrew Brown"
  ],
  "Neurology": [
    "Dr. David Martinez",
    "Dr. Jennifer Lee"
  ],
  "Orthopedics": [
    "Dr. Thomas Anderson",
    "Dr. Rachel Green"
  ],
  "Pediatrics": [
    "Dr. Nancy White",
    "Dr. Kevin Park"
  ]
};

// Utility functions
function generateId(collection) {
  return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
}

// Symptom functions
function addSymptom(symptomData) {
  const newSymptom = {
    id: generateId(symptoms),
    ...symptomData,
    date: symptomData.date || new Date().toISOString().split('T')[0],
    time: symptomData.time || new Date().toTimeString().slice(0, 5)
  };
  symptoms.push(newSymptom);
  return newSymptom;
}

function updateSymptom(id, updatedData) {
  const index = symptoms.findIndex(s => s.id === id);
  if (index !== -1) {
    symptoms[index] = { ...symptoms[index], ...updatedData };
    return symptoms[index];
  }
  return null;
}

function deleteSymptom(id) {
  const index = symptoms.findIndex(s => s.id === id);
  if (index !== -1) {
    return symptoms.splice(index, 1)[0];
  }
  return null;
}

function getSymptomsByDateRange(startDate, endDate) {
  return symptoms.filter(symptom => {
    const symptomDate = new Date(symptom.date);
    return symptomDate >= new Date(startDate) && symptomDate <= new Date(endDate);
  });
}

// Appointment functions
function addAppointment(appointmentData) {
  const newAppointment = {
    id: generateId(appointments),
    ...appointmentData,
    status: appointmentData.status || 'Pending'
  };
  appointments.push(newAppointment);
  return newAppointment;
}

function updateAppointment(id, updatedData) {
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updatedData };
    return appointments[index];
  }
  return null;
}

function cancelAppointment(id) {
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index].status = 'Cancelled';
    return appointments[index];
  }
  return null;
}

function getUpcomingAppointments(days = 30) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= today && 
           appointmentDate <= futureDate && 
           appointment.status !== 'Cancelled';
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Doctor functions
function getDoctorsBySpecialty(specialty) {
  return doctors[specialty] || [];
}

function getAllSpecialties() {
  return Object.keys(doctors);
}

// Display functions
function displaySymptomSummary() {
  if (symptoms.length === 0) {
    console.log("No symptoms recorded yet.");
    return;
  }

  // Group by symptom
  const symptomSummary = symptoms.reduce((acc, symptom) => {
    if (!acc[symptom.symptom]) {
      acc[symptom.symptom] = {
        count: 0,
        totalSeverity: 0,
        lastOccurrence: ''
      };
    }
    acc[symptom.symptom].count++;
    acc[symptom.symptom].totalSeverity += symptom.severity;
    acc[symptom.symptom].lastOccurrence = symptom.date;
    return acc;
  }, {});

  console.log("Symptom Summary:");
  console.log("----------------");
  for (const [symptom, data] of Object.entries(symptomSummary)) {
    const avgSeverity = (data.totalSeverity / data.count).toFixed(1);
    console.log(`${symptom}: Occurred ${data.count} times, Average severity: ${avgSeverity}/10, Last: ${formatDate(data.lastOccurrence)}`);
  }
}

function displayAppointmentStatus() {
  if (appointments.length === 0) {
    console.log("No appointments scheduled yet.");
    return;
  }

  const statusCounts = appointments.reduce((acc, appointment) => {
    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
    return acc;
  }, {});

  console.log("Appointment Status:");
  console.log("------------------");
  for (const [status, count] of Object.entries(statusCounts)) {
    console.log(`${status}: ${count}`);
  }

  const nextAppointment = getUpcomingAppointments(1)[0];
  if (nextAppointment) {
    console.log("\nNext Appointment:");
    console.log(`Doctor: ${nextAppointment.doctor}`);
    console.log(`Date: ${formatDate(nextAppointment.date)} at ${formatTime(nextAppointment.time)}`);
    console.log(`Reason: ${nextAppointment.reason}`);
  }
}

// ===== UI & App Logic =====

document.addEventListener('DOMContentLoaded', () => {
  // --- Section Switching ---
  const sections = {
    home: document.getElementById('home-section'),
    log: document.getElementById('log-section'),
    symptoms: document.getElementById('symptoms-section'),
    chatbot: document.getElementById('chatbot-section'),
    book: document.getElementById('book-section'),
    appointments: document.getElementById('appointments-section'),
    profile: document.getElementById('profile-section') // NEW
  };
  function showSection(section) {
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    Object.values(document.querySelectorAll('.nav-tab')).forEach(tab => tab.classList.remove('active'));
    sections[section].classList.remove('hidden');
    const tabIdx = ['home','log','symptoms','chatbot','book','appointments','profile'].indexOf(section);
    if (tabIdx >= 0) document.querySelectorAll('.nav-tab')[tabIdx].classList.add('active');
    if (section === 'symptoms') renderSymptomsTable();
    if (section === 'appointments') renderAppointmentsTable();
    if (section === 'profile') renderProfileForm();
  }
  window.showSection = showSection;

  // --- Profile Data ---
  let userProfile = {
    name: 'Cavin',
    email: '',
    notifications: true
  };
  function saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    document.getElementById('userName').textContent = userProfile.name;
  }
  function loadProfile() {
    const p = localStorage.getItem('userProfile');
    if (p) userProfile = JSON.parse(p);
    document.getElementById('userName').textContent = userProfile.name;
  }
  function renderProfileForm() {
    document.getElementById('profileName').value = userProfile.name;
    document.getElementById('profileEmail').value = userProfile.email;
    document.getElementById('profileNotifications').checked = userProfile.notifications;
  }
  // Profile form events
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      userProfile.name = document.getElementById('profileName').value.trim() || 'User';
      userProfile.email = document.getElementById('profileEmail').value.trim();
      userProfile.notifications = document.getElementById('profileNotifications').checked;
      saveProfile();
      alert('Profile updated!');
    });
  }

  // --- LocalStorage Persistence ---
  function saveData() {
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
  function loadData() {
    const s = localStorage.getItem('symptoms');
    const a = localStorage.getItem('appointments');
    if (s) symptoms = JSON.parse(s);
    if (a) appointments = JSON.parse(a);
  }
  loadData();
  loadProfile();

  // --- Dashboard Stats ---
  function updateDashboard() {
    document.getElementById('totalSymptoms').textContent = symptoms.length;
    const avg = symptoms.length ? (symptoms.reduce((sum, s) => sum + Number(s.severity), 0) / symptoms.length).toFixed(1) : 0;
    document.getElementById('avgSeverity').textContent = avg;
    document.getElementById('upcomingAppointments').textContent = getUpcomingAppointments().length;
    // Days tracked: unique days with symptoms
    const days = new Set(symptoms.map(s => s.date));
    document.getElementById('daysTracked').textContent = days.size;
  }

  // --- Symptom Form ---
  const symptomForm = document.getElementById('symptomForm');
  const symptomSelect = document.getElementById('symptom');
  const customSymptomGroup = document.getElementById('customSymptomGroup');
  const customSymptomInput = document.getElementById('customSymptom');
  const severitySlider = document.getElementById('severity');
  const severityValue = document.getElementById('severityValue');
  const adviceBox = document.getElementById('advice');
  const adviceText = document.getElementById('adviceText');

  symptomSelect.addEventListener('change', () => {
    if (symptomSelect.value === 'Other') {
      customSymptomGroup.style.display = 'block';
      customSymptomInput.required = true;
    } else {
      customSymptomGroup.style.display = 'none';
      customSymptomInput.required = false;
    }
  });
  severitySlider.addEventListener('input', () => {
    severityValue.textContent = severitySlider.value;
  });
  symptomForm.addEventListener('submit', e => {
    e.preventDefault();
    const symptomType = symptomSelect.value === 'Other' ? customSymptomInput.value.trim() : symptomSelect.value;
    if (!symptomType) return;
    const data = {
      symptom: symptomType,
      severity: Number(severitySlider.value),
      duration: document.getElementById('duration').value,
      notes: document.getElementById('notes').value,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0,5)
    };
    addSymptom(data);
    saveData();
    updateDashboard();
    symptomForm.reset();
    severityValue.textContent = 5;
    customSymptomGroup.style.display = 'none';
    // Show advice
    adviceText.textContent = getHealthAdvice(data);
    adviceBox.classList.remove('hidden');
    setTimeout(() => adviceBox.classList.add('hidden'), 5000);
  });
  function getHealthAdvice(symptom) {
    if (symptom.severity >= 8) return 'High severity. Please consider seeking medical attention.';
    if (symptom.symptom.toLowerCase().includes('pain')) return 'Monitor your pain and rest. If it worsens, consult a doctor.';
    if (symptom.symptom.toLowerCase().includes('fever')) return 'Stay hydrated and rest. If fever persists, see a doctor.';
    return 'Symptom logged. Take care and monitor your health.';
  }

  // --- Symptoms Table ---
  function renderSymptomsTable() {
    const tbody = document.getElementById('symptomsTable');
    tbody.innerHTML = '';
    symptoms.slice().reverse().forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(s.date)} ${s.time}</td>
        <td>${s.symptom}</td>
        <td>${s.severity}</td>
        <td>${s.duration}</td>
        <td>${s.notes || ''}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteSymptomUI(${s.id})"><i class="fas fa-trash"></i></button></td>
      `;
      tbody.appendChild(tr);
    });
  }
  window.deleteSymptomUI = function(id) {
    if (confirm('Delete this symptom log?')) {
      deleteSymptom(id);
      saveData();
      renderSymptomsTable();
      updateDashboard();
    }
  };

  // --- Appointment Form ---
  const appointmentForm = document.getElementById('appointmentForm');
  const specialtySelect = document.getElementById('specialty');
  const doctorSelect = document.getElementById('doctor');
  specialtySelect.addEventListener('change', () => {
    const docs = getDoctorsBySpecialty(specialtySelect.value);
    doctorSelect.innerHTML = '<option value="">Select a doctor...</option>' + docs.map(d => `<option value="${d}">${d}</option>`).join('');
  });
  appointmentForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      patient: document.getElementById('patientName').value,
      specialty: specialtySelect.value,
      doctor: doctorSelect.value,
      date: document.getElementById('appointmentDate').value,
      time: document.getElementById('appointmentTime').value,
      reason: document.getElementById('appointmentReason').value,
      status: 'Pending'
    };
    addAppointment(data);
    saveData();
    appointmentForm.reset();
    updateDashboard();
    alert('Appointment booked!');
  });

  // --- Appointments Table ---
  function renderAppointmentsTable() {
    const tbody = document.getElementById('appointmentsTable');
    tbody.innerHTML = '';
    appointments.slice().reverse().forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${a.doctor}</td>
        <td>${a.specialty}</td>
        <td>${formatDate(a.date)}</td>
        <td>${formatTime(a.time)}</td>
        <td>${a.reason || ''}</td>
        <td>${a.status}</td>
        <td>${a.status !== 'Cancelled' ? `<button class=\"btn btn-danger btn-sm\" onclick=\"cancelAppointmentUI(${a.id})\"><i class=\"fas fa-times\"></i></button>` : ''}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  window.cancelAppointmentUI = function(id) {
    if (confirm('Cancel this appointment?')) {
      cancelAppointment(id);
      saveData();
      renderAppointmentsTable();
      updateDashboard();
    }
  };

  // --- AI Chatbot ---
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatMessages = document.getElementById('chatMessages');
  sendBtn.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
  function sendChat() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    appendChat('user', msg);
    chatInput.value = '';
    setTimeout(() => appendChat('bot', getBotReply(msg)), 700);
  }
  function appendChat(sender, text) {
    const div = document.createElement('div');
    div.className = 'message ' + (sender === 'bot' ? 'bot' : 'user');
    div.innerHTML = `<div class="message-content"><strong>${sender === 'bot' ? 'MediBot' : 'You'}:</strong> ${text}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function getBotReply(msg) {
    msg = msg.toLowerCase();
    if (msg.includes('fever')) return 'Fever can be caused by many things. Stay hydrated and rest. If it persists, consult a doctor.';
    if (msg.includes('headache')) return 'Headaches are common. Try to rest and drink water. If severe, seek medical advice.';
    if (msg.includes('appointment')) return 'You can book an appointment in the Book Appointment section.';
    if (msg.includes('symptom')) return 'You can log your symptoms in the Log Symptom section.';
    if (msg.includes('hello') || msg.includes('hi')) return 'Hello! How can I assist you with your health today?';
    return 'I am here to help with general health questions. For emergencies, contact a healthcare professional.';
  }

  // --- Initial Render ---
  updateDashboard();
  renderSymptomsTable();
  renderAppointmentsTable();
  showSection('home');
});
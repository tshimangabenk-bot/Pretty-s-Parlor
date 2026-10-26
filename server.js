const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const appointments = [];

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: "Pretty's Parlor booking server is running" });
});

app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
  const { name, phone, service, date, notes, paymentMethod } = req.body;

  if (!name || !phone || !service) {
    return res.status(400).json({ error: 'Name, phone, and service are required.' });
  }

  const appointment = {
    id: Date.now().toString(),
    name,
    phone,
    service,
    date: date || 'Flexible',
    notes: notes || '',
    paymentMethod: paymentMethod || 'cash',
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);

  res.status(201).json({
    success: true,
    message: 'Appointment request saved successfully.',
    appointment,
  });
});

app.get('/api/instagram', (req, res) => {
  res.json({
    posts: [
      { id: 1, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', caption: '#BridalGlow' },
      { id: 2, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', caption: '#LuxurySkin' },
      { id: 3, image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80', caption: '#BeautyMoments' },
      { id: 4, image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=80', caption: '#StudioPretty' }
    ]
  });
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Pretty's Parlor server running at http://localhost:${PORT}`);
});

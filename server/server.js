require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup
// Fallback to SQLite if no DB environment variables are provided
const databaseUrl = process.env.DATABASE_URL || 'sqlite:leads.db';
const sequelize = new Sequelize(databaseUrl, {
    dialectOptions: databaseUrl.startsWith('mysql') ? {
        ssl: {
            rejectUnauthorized: false
        }
    } : {},
    logging: false
});

// Model Definition
const Lead = sequelize.define('Lead', {
    foundHome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    wantsTour: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Sync Database
sequelize.sync({ alter: true })
    .then(() => console.log('Database synced successfully'))
    .catch(err => console.error('Error syncing database:', err));

// Routes
app.post('/api/leads', async (req, res) => {
    try {
        const { foundHome, name, email, phone, location, wantsTour } = req.body;
        const lead = await Lead.create({
            foundHome,
            name,
            email,
            phone,
            location,
            wantsTour
        });
        console.log('New lead logged:', lead.toJSON());
        res.status(201).json({ message: 'Lead logged successfully', data: lead });
    } catch (error) {
        console.error('Error logging lead:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/leads', async (req, res) => {
    try {
        const leads = await Lead.findAll();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

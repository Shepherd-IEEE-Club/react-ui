// server.js

const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3001;

// Enable CORS so your front end (e.g., Storybook) can access the API
app.use(cors());

// Initialize Sequelize to use your SQLite file.
// Adjust the path to your SQLite database file as needed.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/postmarks.db',
    logging: false,
});

// Define the Postmark model corresponding to your table.
const Postmark = sequelize.define('Postmark', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
    postmark: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    town: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_seen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    colors: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'postmarks', // Must match your table name exactly.
    timestamps: false,      // Disable if your table doesn't have createdAt/updatedAt.
});

// API endpoint that fetches all postmarks using Sequelize's ORM methods.
// API endpoint to fetch postmarks with pagination
// API endpoint to fetch postmarks with image conversion
app.get('/api/postmarks', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    // Unpack possible query options
    const {
        start_year,
        end_year
    } = req.query;

    // Construct where clause
    const whereClause = {};

    // TODO client's job to default either year if not given

    // Add date filtering if both start_year and end_year are provided
    if (start_year && end_year) {
        whereClause.date_seen = {
            [Sequelize.Op.between]: [`${start_year}-01-01`, `${end_year}-12-31`]
        };
    }

    // try {
    const postmarks = await Postmark.findAll({
        where: whereClause,
        limit,
        offset,
    });

    // Convert image blob to Base64 string for each record
    const formattedPostmarks = postmarks.map(pm => {
        const imageBase64 = pm.image ? pm.image.toString('base64') : null;
        return {
            ...pm.toJSON(),
            image: imageBase64,
        };
    });

    res.json({ data: formattedPostmarks });
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
});

// Authenticate the database connection and start the server.
sequelize.authenticate()
    .then(() => {
        console.log('Connected to SQLite successfully.');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

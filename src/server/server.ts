import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes, Op } from 'sequelize';


const app = express();
const port = 3001;


import { PostmarkListSchema } from '@woco/schema';


// Enable CORS so your front end (e.g., Storybook) can access the API
app.use(cors());

import { initDb } from '@woco/db';
import { PostmarkModel } from '@woco/db/models/postmark';

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
    const postmarks = await PostmarkModel.findAll({
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

// FIXME Looks stupid
initDb()
    .then(
        () => app.listen(port, () =>
        console.log(`🌐  http://localhost:${port}`)))
    .catch(err => {
        console.error('DB init failed:', err);
        process.exit(1);
    });
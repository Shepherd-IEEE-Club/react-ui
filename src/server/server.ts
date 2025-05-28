import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes, Op } from 'sequelize';
import { initDb } from '@woco/db';
import {appRouter} from "./appRouter.ts";

import * as trpcExpress from '@trpc/server/adapters/express';
import superjson from "superjson";
const app = express();
const port = 3001;


// Enable CORS so your front end (e.g., Storybook) can access the API
// 🟢 Make sure JSON parser is BEFORE tRPC middleware
app.use(cors());
app.use(express.json()); // 🧠 ESSENTIAL!!

app.use('/trpc', (req, res, next) => {
    console.log('🧭 Request:', req.method, req.url);
    next();
});

// ✅ Wire the middleware directly
app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: () => ({}),
        transformer: superjson,

        onError({ error, path }) {
            console.error(`❌ TRPC error in ${path ?? '<no-path>'}:`, error.message);
        },
    }),
);

const path = require('path');
app.use(express.static(path.join(__dirname, '../web/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../web/dist/index.html'));
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

// console.dir(appRouter._def.record, { depth: 5 });
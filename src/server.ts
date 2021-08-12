/// <reference path="global.d.ts" />
require('dotenv').config();

import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import { json, urlencoded } from 'body-parser';

import * as routes from './routes/routes';
import databaseSetup from './database';

async function initialize() {
    const PORT: any = process.env.PORT;
    await databaseSetup();

    const app = express();

    app.use(json({limit: '50mb'}));
    app.use(urlencoded({extended: true, limit: '50mb'}));

    app.use(cors({
        optionsSuccessStatus: 200,
        origin: '*',
        allowedHeaders: ['Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, X-Requested-With']
    }));

    let server = new http.Server(app);

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    server.listen(PORT, () => {
        console.log('--> HTTPS Server successfully started at port ' + PORT);
    });

    routes.initRoutes(app);
}

initialize();

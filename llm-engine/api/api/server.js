"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
const reindexRouter = require("./reindex.js");
const Scheduler_js_1 = require("../Scheduler.js");
const app = express();
const PORT = process.env.PORT || 3000;
// Create scheduler instance
const scheduler = new Scheduler_js_1.Scheduler();
// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the processed directory
app.use('/processed', express.static(path.join(__dirname, '..', 'processed')));
// Mount reindex router
app.use('/llm', reindexRouter.default);
// ... rest of the file remains the same ...

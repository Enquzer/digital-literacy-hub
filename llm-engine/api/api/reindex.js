"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VectorDB_1 = require("../vector-db/VectorDB");
const router = express_1.default.Router();
const vectorDB = new VectorDB_1.VectorDB();
/**
 * Re-generate embeddings for given module id(s)
 * POST /llm/reindex
 * Body: { moduleIds: string[] }
 */
router.post('/reindex', async (req, res) => {
    try {
        const { moduleIds } = req.body;
        if (!moduleIds || !Array.isArray(moduleIds)) {
            return res.status(400).json({
                success: false,
                error: 'moduleIds array is required'
            });
        }
        // Reindex the specified modules
        await vectorDB.reindexModules(moduleIds);
        res.json({
            success: true,
            message: `Successfully reindexed ${moduleIds.length} modules`,
            data: { reindexedModules: moduleIds }
        });
    }
    catch (error) {
        console.error('Error reindexing modules:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reindex modules'
        });
    }
});
exports.default = router;

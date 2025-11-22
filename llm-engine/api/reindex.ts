import express = require('express');
import { VectorDB } from '../vector-db/VectorDB';

const router = express.Router();
const vectorDB = new VectorDB();

/**
 * Re-generate embeddings for given module id(s)
 * POST /llm/reindex
 * Body: { moduleIds: string[] }
 */
router.post('/reindex', async (req: express.Request, res: express.Response) => {
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
  } catch (error) {
    console.error('Error reindexing modules:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reindex modules'
    });
  }
});

export default router;
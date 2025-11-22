// Migration script to add learner tracking tables
const { mysqlPool: dbPool, testMySQLConnection: testConnection } = require('./api/database');

async function migrateLearnerTracking() {
  console.log('Migrating learner tracking tables...');
  try {
    // Test connection first
    const isConnected = await testConnection();
    console.log('Database connection:', isConnected ? 'Successful' : 'Using mock implementation');
    
    // Create learning_progress table
    console.log('Creating learning_progress table...');
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS learning_progress (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        module_id VARCHAR(36) NOT NULL,
        status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
        progress_percentage INT DEFAULT 0,
        time_spent_seconds INT DEFAULT 0,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        quiz_score DECIMAL(5,2) NULL,
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_module (user_id, module_id)
      )
    `);
    console.log('Learning progress table created or already exists');
    
    // Create quiz_attempts table
    console.log('Creating quiz_attempts table...');
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        quiz_id VARCHAR(36) NOT NULL,
        module_id VARCHAR(36) NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        max_score INT NOT NULL,
        passed BOOLEAN NOT NULL,
        attempt_number INT NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
      )
    `);
    console.log('Quiz attempts table created or already exists');
    
    // Create certificates table
    console.log('Creating certificates table...');
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        module_id VARCHAR(36) NOT NULL,
        certificate_url VARCHAR(512) NOT NULL,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
      )
    `);
    console.log('Certificates table created or already exists');
    
    // Create learning_analytics table
    console.log('Creating learning_analytics table...');
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS learning_analytics (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        metric_type VARCHAR(50) NOT NULL,
        metric_value DECIMAL(10,2) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
      )
    `);
    console.log('Learning analytics table created or already exists');
    
    console.log('Learner tracking migration completed successfully');
  } catch (error) {
    console.error('Learner tracking migration failed:', error);
  }
}

migrateLearnerTracking();
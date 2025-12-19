import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Get database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'motus_relayer',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

// Log database configuration (without password) for debugging
console.log('📊 Database Configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  hasPassword: !!dbConfig.password,
});

// Warn if using defaults (likely means env vars not set)
if (dbConfig.host === 'localhost' && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  WARNING: Using default DB_HOST=localhost in production!');
  console.warn('⚠️  Make sure DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD are set in Railway environment variables.');
}

// Database connection pool
export const pool = new Pool({
  ...dbConfig,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Initialize database schema
export async function initializeSchema() {
  try {
    const fs = await import('fs');
    const path = await import('path');

    // Try development and production paths (no __dirname – works with ESM)
    const possiblePaths = [
      path.join(process.cwd(), 'src', 'db', 'schema.sql'), // Local dev
      path.join(process.cwd(), 'dist', 'db', 'schema.sql'), // Production (copied by build)
    ];

    let schemaPath: string | null = null;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        schemaPath = possiblePath;
        break;
      }
    }

    if (!schemaPath) {
      throw new Error(`Schema file not found. Tried: ${possiblePaths.join(', ')}`);
    }

    console.log(`📄 Loading schema from: ${schemaPath}`);
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    await query(schema);
    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Failed to initialize schema:', error);
    throw error;
  }
}



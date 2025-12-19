import { mkdirSync, copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Create dist/contracts directory
const distContractsDir = join(rootDir, 'dist', 'contracts');
if (!existsSync(distContractsDir)) {
  mkdirSync(distContractsDir, { recursive: true });
}

// Create dist/db directory
const distDbDir = join(rootDir, 'dist', 'db');
if (!existsSync(distDbDir)) {
  mkdirSync(distDbDir, { recursive: true });
}

// Copy contract JSON file
const contractSource = join(rootDir, 'src', 'contracts', 'MotusNameService.json');
const contractDest = join(distContractsDir, 'MotusNameService.json');

if (existsSync(contractSource)) {
  copyFileSync(contractSource, contractDest);
  console.log(`✅ Copied ${contractSource} to ${contractDest}`);
} else {
  console.error(`❌ Source file not found: ${contractSource}`);
  process.exit(1);
}

// Copy schema.sql file
const schemaSource = join(rootDir, 'src', 'db', 'schema.sql');
const schemaDest = join(distDbDir, 'schema.sql');

if (existsSync(schemaSource)) {
  copyFileSync(schemaSource, schemaDest);
  console.log(`✅ Copied ${schemaSource} to ${schemaDest}`);
} else {
  console.warn(`⚠️  Schema file not found: ${schemaSource} (this is OK if migrations are run separately)`);
}




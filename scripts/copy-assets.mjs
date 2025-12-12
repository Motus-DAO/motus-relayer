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

// Copy JSON files
const sourceFile = join(rootDir, 'src', 'contracts', 'MotusNameService.json');
const destFile = join(distContractsDir, 'MotusNameService.json');

if (existsSync(sourceFile)) {
  copyFileSync(sourceFile, destFile);
  console.log(`✅ Copied ${sourceFile} to ${destFile}`);
} else {
  console.error(`❌ Source file not found: ${sourceFile}`);
  process.exit(1);
}

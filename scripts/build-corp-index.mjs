import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const corpXmlPath = resolve(__dirname, '../data/corp.xml');
const outputDir = resolve(__dirname, '../public');
const outputPath = resolve(outputDir, 'corp-index.json');

try {
  const xmlContent = readFileSync(corpXmlPath, 'utf-8');
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: false,
  });

  const result = parser.parse(xmlContent);
  const lists = Array.isArray(result.result?.list) ? result.result.list : [result.result?.list].filter(Boolean);

  const corpIndex = lists.map((item) => ({
    corp_code: String(item.corp_code || '').padStart(8, '0'),
    corp_name: item.corp_name || '',
    corp_eng_name: item.corp_eng_name || '',
    stock_code: String(item.stock_code || '').padStart(6, '0'),
  }));

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(corpIndex, null, 2), 'utf-8');

  console.log(`✓ Generated ${corpIndex.length} corporations in corp-index.json`);
} catch (error) {
  console.error('✗ Failed to build corp index:', error.message);
  process.exit(1);
}

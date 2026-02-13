#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../../_posts');
const OUTPUT_DIR = path.join(__dirname, '../src/content/blog');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function convertPost(filename) {
  const filePath = path.join(POSTS_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract front matter and body using regex
  const frontMatterMatch = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);

  if (!frontMatterMatch) {
    console.error(`✗ Could not parse front matter in ${filename}`);
    return;
  }

  const [, frontMatterStr, body] = frontMatterMatch;

  // Parse front matter line by line
  const lines = frontMatterStr.split('\n');
  const frontMatter = {};

  for (const line of lines) {
    // Match key: value or key: [array]
    const match = line.match(/^(\w+):\s*(.+?)(?:\s*#.*)?$/);
    if (match) {
      const [, key, value] = match;

      // Handle arrays [item1, item2]
      if (value.startsWith('[') && value.endsWith(']')) {
        frontMatter[key] = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim());
      } else {
        frontMatter[key] = value.trim();
      }
    }
  }

  // Extract just the date (YYYY-MM-DD)
  let date = frontMatter.date || '';
  const dateMatch = date.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    date = dateMatch[1];
  }

  // Convert Jekyll prompts to standard markdown
  let newBody = body;
  newBody = newBody.replace(/>\s*(.+?)\n\{:\s*\.prompt-tip\s*\}/g, '> **Tip:** $1');
  newBody = newBody.replace(/>\s*(.+?)\n\{:\s*\.prompt-info\s*\}/g, '> **Info:** $1');
  newBody = newBody.replace(/>\s*(.+?)\n\{:\s*\.prompt-warning\s*\}/g, '> **Warning:** $1');

  // Build new front matter
  const newFrontMatter = [];
  newFrontMatter.push('---');
  newFrontMatter.push(`title: ${frontMatter.title || 'Untitled'}`);
  newFrontMatter.push(`date: ${date}`);

  if (frontMatter.categories) {
    const cats = Array.isArray(frontMatter.categories)
      ? frontMatter.categories
      : [frontMatter.categories];
    newFrontMatter.push(`categories: [${cats.join(', ')}]`);
  }

  if (frontMatter.tags) {
    const tags = Array.isArray(frontMatter.tags)
      ? frontMatter.tags
      : [frontMatter.tags];
    newFrontMatter.push(`tags: [${tags.join(', ')}]`);
  }

  newFrontMatter.push('---');

  // Build final content
  const newContent = newFrontMatter.join('\n') + '\n' + newBody;

  // Write to output
  const outputPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outputPath, newContent);

  console.log(`✓ Migrated: ${filename}`);
}

function migrateAllPosts() {
  console.log('Starting migration...\n');

  const files = fs.readdirSync(POSTS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md') && f !== '.placeholder');

  console.log(`Found ${mdFiles.length} posts to migrate\n`);

  for (const file of mdFiles) {
    try {
      convertPost(file);
    } catch (error) {
      console.error(`✗ Error migrating ${file}:`, error.message);
    }
  }

  console.log(`\n✓ Migration complete! Migrated ${mdFiles.length} posts`);
}

// Run migration
migrateAllPosts();

#!/usr/bin/env node

/**
 * Migration script to convert Jekyll posts to Astro format
 *
 * Usage: node scripts/migrate-posts.js
 *
 * This script:
 * 1. Reads all posts from _posts/
 * 2. Converts Jekyll front matter to Astro format
 * 3. Updates image paths
 * 4. Converts Jekyll-specific syntax to standard Markdown
 * 5. Outputs to src/content/blog/
 */

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

function convertJekyllPrompt(content) {
  // Convert Jekyll prompts to standard blockquotes
  // {: .prompt-tip } → > **Tip:**
  // {: .prompt-info } → > **Info:**
  // {: .prompt-warning } → > **Warning:**

  content = content.replace(/>\s*(.+?)\n\{:\s*\.prompt-tip\s*\}/g, '> **Tip:** $1');
  content = content.replace(/>\s*(.+?)\n\{:\s*\.prompt-info\s*\}/g, '> **Info:** $1');
  content = content.replace(/>\s*(.+?)\n\{:\s*\.prompt-warning\s*\}/g, '> **Warning:** $1');

  return content;
}

function convertImagePaths(content) {
  // Images are already in /assets/img/ which will work in Astro
  // Just ensure they use standard markdown syntax
  return content;
}

function convertLinks(content) {
  // Convert Jekyll-style links to standard markdown
  // Most should already be standard
  return content;
}

function extractFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { frontMatter: {}, body: content };
  }

  const [, frontMatterStr, body] = match;
  const frontMatter = {};

  // Parse YAML-like front matter
  const lines = frontMatterStr.split('\n');
  let currentKey = null;
  let currentValue = [];

  for (const line of lines) {
    if (line.match(/^(\w+):\s*(.*)$/)) {
      // Save previous key if exists
      if (currentKey) {
        frontMatter[currentKey] = currentValue.length === 1
          ? currentValue[0]
          : currentValue;
      }

      const [, key, value] = line.match(/^(\w+):\s*(.*)$/);
      currentKey = key;

      // Handle arrays
      if (value.startsWith('[')) {
        const arrayMatch = value.match(/\[(.*?)\]/);
        if (arrayMatch) {
          currentValue = arrayMatch[1].split(',').map(v => v.trim());
        } else {
          currentValue = [];
        }
      } else {
        currentValue = [value];
      }
    } else if (line.trim().startsWith('-') && currentKey) {
      // Array item
      currentValue.push(line.trim().substring(1).trim());
    }
  }

  // Save last key
  if (currentKey) {
    frontMatter[currentKey] = currentValue.length === 1
      ? currentValue[0]
      : currentValue;
  }

  return { frontMatter, body };
}

function convertPost(filename) {
  const filePath = path.join(POSTS_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');

  const { frontMatter, body } = extractFrontMatter(content);

  // Convert date format - extract just YYYY-MM-DD
  let date = frontMatter.date;
  if (date) {
    // Extract just the date part (YYYY-MM-DD)
    const dateMatch = date.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      date = dateMatch[1];
    }
  }

  // Build new front matter
  const newFrontMatter = {
    title: frontMatter.title,
    date: date,
    ...(frontMatter.categories && { categories: frontMatter.categories }),
    ...(frontMatter.tags && { tags: frontMatter.tags }),
  };

  // Convert body content
  let newBody = body;
  newBody = convertJekyllPrompt(newBody);
  newBody = convertImagePaths(newBody);
  newBody = convertLinks(newBody);

  // Build new content
  const newContent = `---
title: ${newFrontMatter.title}
date: ${newFrontMatter.date}
${newFrontMatter.categories ? `categories: [${newFrontMatter.categories.join(', ')}]` : ''}
${newFrontMatter.tags ? `tags: [${newFrontMatter.tags.join(', ')}]` : ''}
---
${newBody}`;

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
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review migrated posts in src/content/blog/');
  console.log('2. Copy assets folder to astro-site/public/');
  console.log('3. Test locally with: npm run dev');
  console.log('4. Build for production: npm run build');
}

// Run migration
migrateAllPosts();

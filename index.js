#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

// Load skills database
const SKILLS_DB_PATH = path.join(__dirname, 'data', 'all_skills_with_cn.json');
let skillsDatabase = [];

try {
  const data = fs.readFileSync(SKILLS_DB_PATH, 'utf-8');
  skillsDatabase = JSON.parse(data);
  console.log(`✓ Loaded ${skillsDatabase.length} skills from database`);
} catch (error) {
  console.error(`✗ Failed to load skills database: ${error.message}`);
  process.exit(1);
}

// Search skills by query
function searchSkills(query, limit = 10) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  for (const skill of skillsDatabase) {
    let score = 0;

    // Search in name (highest priority)
    if (skill.name && skill.name.toLowerCase().includes(lowerQuery)) {
      score += 10;
    }

    // Search in description
    if (skill.description && skill.description.toLowerCase().includes(lowerQuery)) {
      score += 5;
    }

    // Search in author
    if (skill.author && skill.author.toLowerCase().includes(lowerQuery)) {
      score += 3;
    }

    if (score > 0) {
      results.push({ skill, score });
    }
  }

  // Sort by score (descending) and stars
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.skill.stars || 0) - (a.skill.stars || 0);
  });

  return results.slice(0, limit).map(r => r.skill);
}

// Display search results
function displayResults(skills) {
  if (skills.length === 0) {
    console.log('\n❌ No skills found matching your query.\n');
    return;
  }

  console.log(`\n📦 Found ${skills.length} matching skills:\n`);

  skills.forEach((skill, index) => {
    console.log(`${index + 1}. ${skill.name} (by ${skill.author})`);
    console.log(`   ⭐ ${skill.stars || 0} stars | 🔀 ${skill.forks || 0} forks`);
    console.log(`   📝 ${skill.description?.substring(0, 100)}...`);
    console.log(`   🔗 ${skill.githubUrl}`);
    console.log('');
  });
}

// Download file from URL
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadFile(response.headers.location).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Install skill
async function installSkill(skill) {
  console.log(`\n📥 Installing skill: ${skill.name}...`);

  try {
    // Get the raw GitHub URL for SKILL.md
    const rawUrl = skill.githubUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/tree/', '/');

    const skillMdUrl = `${rawUrl}/${skill.path}`;
    console.log(`   Downloading from: ${skillMdUrl}`);

    // Download SKILL.md content
    const content = await downloadFile(skillMdUrl);

    // Determine installation directory
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const claudeSkillsDir = path.join(homeDir, '.claude', 'skills');

    // Create skills directory if it doesn't exist
    if (!fs.existsSync(claudeSkillsDir)) {
      fs.mkdirSync(claudeSkillsDir, { recursive: true });
      console.log(`   ✓ Created skills directory: ${claudeSkillsDir}`);
    }

    // Create skill directory
    const skillDir = path.join(claudeSkillsDir, skill.name);
    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }

    // Write SKILL.md file
    const skillPath = path.join(skillDir, 'SKILL.md');
    fs.writeFileSync(skillPath, content, 'utf-8');

    console.log(`   ✓ Installed to: ${skillPath}`);

    // Parse SKILL.md content for configuration info
    const config = parseSkillConfig(content);

    // Display configuration and usage guide
    displaySkillGuide(skill, config, skillPath);

    return true;
  } catch (error) {
    console.error(`   ✗ Installation failed: ${error.message}`);
    return false;
  }
}

// Parse SKILL.md for configuration information
function parseSkillConfig(content) {
  const config = {
    name: '',
    description: '',
    usage: '',
    examples: [],
    dependencies: []
  };

  // Extract name from header
  const nameMatch = content.match(/^#\s+(.+?)$/m);
  if (nameMatch) config.name = nameMatch[1];

  // Extract description
  const descMatch = content.match(/##?\s+Description\s*\n+([\s\S]+?)(?=\n##|$)/i);
  if (descMatch) config.description = descMatch[1].trim();

  // Extract usage
  const usageMatch = content.match(/##?\s+Usage\s*\n+([\s\S]+?)(?=\n##|$)/i);
  if (usageMatch) config.usage = usageMatch[1].trim();

  // Extract examples
  const examplesMatch = content.match(/##?\s+Examples?\s*\n+([\s\S]+?)(?=\n##|$)/i);
  if (examplesMatch) {
    const examplesText = examplesMatch[1];
    config.examples = examplesText.split(/\n\n+/).filter(e => e.trim());
  }

  return config;
}

// Display skill configuration and usage guide
function displaySkillGuide(skill, config, installPath) {
  console.log('\n' + '='.repeat(80));
  console.log(`📖 Configuration & Usage Guide for: ${skill.name}`);
  console.log('='.repeat(80));

  console.log(`\n📍 Installation Path:`);
  console.log(`   ${installPath}`);

  console.log(`\n📝 Description:`);
  console.log(`   ${skill.description || config.description || 'No description available'}`);

  console.log(`\n👤 Author:`);
  console.log(`   ${skill.author}`);

  console.log(`\n⭐ GitHub Stats:`);
  console.log(`   Stars: ${skill.stars || 0} | Forks: ${skill.forks || 0}`);
  console.log(`   Repository: ${skill.githubUrl}`);

  if (config.usage) {
    console.log(`\n🚀 Usage:`);
    config.usage.split('\n').forEach(line => {
      console.log(`   ${line}`);
    });
  }

  if (config.examples && config.examples.length > 0) {
    console.log(`\n💡 Examples:`);
    config.examples.slice(0, 3).forEach((example, i) => {
      console.log(`\n   Example ${i + 1}:`);
      example.split('\n').forEach(line => {
        console.log(`   ${line}`);
      });
    });
  }

  console.log(`\n✅ Next Steps:`);
  console.log(`   1. Restart Claude Code to load the skill`);
  console.log(`   2. Use the skill in your conversations`);
  console.log(`   3. Check the SKILL.md file for detailed documentation`);

  console.log('\n' + '='.repeat(80) + '\n');
}

// Interactive mode
function interactiveMode(query) {
  const results = searchSkills(query, 20);
  displayResults(results);

  if (results.length === 0) return;

  // In skill context, we'll output JSON for Claude to process
  const output = {
    query: query,
    results: results.map((skill, index) => ({
      index: index + 1,
      name: skill.name,
      author: skill.author,
      description: skill.description,
      stars: skill.stars || 0,
      forks: skill.forks || 0,
      githubUrl: skill.githubUrl
    }))
  };

  console.log('\n---JSON-OUTPUT---');
  console.log(JSON.stringify(output, null, 2));
  console.log('---END-JSON-OUTPUT---\n');
}

// Install by index
async function installByIndex(query, index) {
  const results = searchSkills(query, 20);

  if (index < 1 || index > results.length) {
    console.error(`\n❌ Invalid index. Please choose between 1 and ${results.length}\n`);
    return false;
  }

  const skill = results[index - 1];
  return await installSkill(skill);
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Skill Manager - Search and Install Claude Code Skills

Usage:
  node index.js search <query>          Search for skills
  node index.js install <query> <index> Install a skill by search index
  node index.js direct <github-url>     Install directly from GitHub URL

Examples:
  node index.js search "python testing"
  node index.js install "python testing" 1
`);
    return;
  }

  const command = args[0];

  if (command === 'search') {
    const query = args.slice(1).join(' ');
    if (!query) {
      console.error('❌ Please provide a search query');
      return;
    }
    interactiveMode(query);
  } else if (command === 'install') {
    const query = args.slice(1, -1).join(' ');
    const index = parseInt(args[args.length - 1]);

    if (!query || isNaN(index)) {
      console.error('❌ Usage: node index.js install <query> <index>');
      return;
    }

    await installByIndex(query, index);
  } else {
    console.error(`❌ Unknown command: ${command}`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { searchSkills, installSkill, displayResults };

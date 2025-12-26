# Skill Manager

A comprehensive Claude Code skill manager that allows you to search, browse, and install skills from a database of 31,767+ community skills.

## Features

✅ **Comprehensive Database**: Access to 31,767 Claude Code skills from the community
✅ **Intelligent Search**: Weighted scoring algorithm searches by name, description, and author
✅ **Bilingual Support**: Includes both English and Chinese descriptions (99.95% translated)
✅ **Easy Installation**: One-command download and installation from GitHub
✅ **Detailed Guides**: Automatically displays configuration and usage information
✅ **GitHub Integration**: Direct integration with GitHub raw content API

## Community  

[17136](https://github.com/17136)
[Mo Ling Dream](https://x.com/MolingDream)
![微信公众号交流群:agisir](./data/acc.png)

## Installation

1. Copy the `skill-manager` directory to your desired location
2. The skills database is included at `skill-manager/data/all_skills_with_cn.json`
3. Install as a Claude Code skill by copying to `~/.claude/skills/skill-manager/`

## Usage

### Command Line Interface

The skill manager provides three main commands:

#### 1. Search for Skills

```bash
node index.js search "<query>"
```

**Examples:**
```bash
node index.js search "python testing"
node index.js search "docker"
node index.js search "react components"
```

This will display:
- Skill name and author
- GitHub stars and forks
- Description preview
- GitHub URL
- JSON output for programmatic use

#### 2. Install a Skill

```bash
node index.js install "<query>" <index>
```

**Examples:**
```bash
node index.js install "python testing" 1
node index.js install "docker" 3
```

This will:
1. Search for skills matching the query
2. Download the skill at the specified index
3. Install to `~/.claude/skills/<skill-name>/SKILL.md`
4. Display comprehensive configuration and usage guide

#### 3. Direct Installation (Future)

```bash
node index.js direct <github-url>
```

Install directly from a GitHub URL (to be implemented).

### As a Claude Code Skill

When installed as a Claude Code skill, you can use natural language:

```
"I need a skill for Python testing"
"Find me Docker skills"
"Search for API development skills"
"Install skill number 2"
```

Claude will:
1. Search the database
2. Show you matching results
3. Install your selected skill
4. Display the usage guide

## Database Structure

The skills database (`all_skills_with_cn.json`) contains:

```json
{
  "id": "unique-skill-id",
  "name": "skill-name",
  "author": "github-username",
  "description": "English description",
  "description_cn": "中文描述",
  "stars": 100,
  "forks": 20,
  "githubUrl": "https://github.com/...",
  "path": "SKILL.md",
  "branch": "main",
  "updatedAt": 1234567890
}
```

## Search Algorithm

The search uses weighted scoring:
- **Name match**: 10 points
- **Description match**: 5 points
- **Author match**: 3 points

Results are sorted by:
1. Relevance score (descending)
2. GitHub stars (descending)

## Installation Process

When you install a skill, the manager:

1. **Converts GitHub URL** to raw content URL
   - `github.com` → `raw.githubusercontent.com`
   - `/tree/` → `/`

2. **Downloads SKILL.md** from GitHub

3. **Creates skill directory**
   - Location: `~/.claude/skills/<skill-name>/`
   - Creates parent directories if needed

4. **Writes SKILL.md file**
   - UTF-8 encoding
   - Preserves original formatting

5. **Parses configuration**
   - Extracts name, description, usage, examples
   - Parses markdown structure

6. **Displays usage guide**
   - Installation path
   - Author and GitHub stats
   - Usage instructions
   - Examples
   - Next steps

## Output Formats

### Search Results (Human-Readable)

```
📦 Found 9 matching skills:

1. python-testing (by athola)
   ⭐ 11 stars | 🔀 2 forks
   📝 Python testing with pytest, fixtures, mocking...
   🔗 https://github.com/athola/claude-night-market/...
```

### Search Results (JSON)

```json
{
  "query": "python testing",
  "results": [
    {
      "index": 1,
      "name": "python-testing",
      "author": "athola",
      "description": "...",
      "stars": 11,
      "forks": 2,
      "githubUrl": "..."
    }
  ]
}
```

### Installation Guide

```
================================================================================
📖 Configuration & Usage Guide for: python-testing
================================================================================

📍 Installation Path:
   C:\Users\username\.claude\skills\python-testing\SKILL.md

📝 Description:
   Python testing with pytest, fixtures, mocking...

👤 Author:
   athola

⭐ GitHub Stats:
   Stars: 11 | Forks: 2
   Repository: https://github.com/...

✅ Next Steps:
   1. Restart Claude Code to load the skill
   2. Use the skill in your conversations
   3. Check the SKILL.md file for detailed documentation
```

## Requirements

- **Node.js**: v14 or higher
- **Internet**: For downloading skills from GitHub
- **Database**: `all_skills_with_cn.json` (30.33 MB)

## Database Statistics

- **Total Skills**: 31,767
- **With Chinese Translations**: 31,752 (99.95%)
- **Last Updated**: 2025-12-26
- **Database Size**: 30.33 MB

## File Structure

```
skill-manager/
├── index.js                     # Main implementation
├── SKILL.md                     # Skill configuration
├── README.md                    # This file
├── package.json                 # NPM package definition
├── PROJECT_SUMMARY.md           # Project summary
└── data/
    └── all_skills_with_cn.json  # Skills database (30.33 MB)
```

## Error Handling

The skill manager handles:
- ✅ Network errors with proper error messages
- ✅ Missing files with clear warnings
- ✅ Invalid indices with helpful feedback
- ✅ HTTP redirects automatically
- ✅ GitHub rate limiting (graceful degradation)

## Future Enhancements

Potential improvements:
- [ ] Direct installation from GitHub URL
- [ ] Skill update checking
- [ ] Local caching of popular skills
- [ ] Skill ratings and reviews
- [ ] Advanced filtering (by language, category, etc.)
- [ ] Skill dependencies management
- [ ] Bulk installation

## License

This skill manager is created for the Claude Code community. The skills database is compiled from public GitHub repositories.

## Credits

- **Database Translation**: 99.95% automated translation using GLM-4.5-Air
- **Skills Source**: 31,767 skills from GitHub community repositories
- **Created**: 2025-12-26

## Support

For issues or questions:
1. Check the SKILL.md file in the skill directory
2. Visit the skill's GitHub repository
3. Review the skills database for accuracy

---

**Version**: 1.0.0
**Last Updated**: 2025-12-26

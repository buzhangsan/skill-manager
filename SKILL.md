# Skill Manager

A Claude Code skill that allows you to search, browse, and install skills from a database of 31,767+ community skills.

## Description

Skill Manager provides an easy way to discover and install Claude Code skills. Simply describe what you're looking for, and it will search through a comprehensive database of skills, display matching results with ratings and descriptions, and automatically download and install your selected skill to your Claude environment.

## Features

- Search through 31,767+ skills from the community
- Intelligent search with weighted scoring (name, description, author)
- View skill details including stars, forks, author, and description
- One-command installation directly from GitHub
- Automatic configuration and usage guide display
- Support for both English and Chinese descriptions

## Usage

When you need to find and install a skill, simply tell Claude what you're looking for:

```
I need a skill for Python testing
```

```
Find me a skill to help with Docker
```

```
Search for skills related to API development
```

Claude will:
1. Search the skills database
2. Display matching results with ratings
3. Ask you to select one
4. Download and install it automatically
5. Show you the configuration and usage guide

## Installation

This skill includes the skills database file in the `data/` directory:
- `skill-manager/data/all_skills_with_cn.json` (30.33 MB)

## Technical Details

The skill uses Node.js to:
- Parse and search the JSON skills database
- Download SKILL.md files from GitHub raw URLs
- Install skills to `~/.claude/skills/` directory
- Parse skill configuration from SKILL.md content
- Display formatted installation guides

## Examples

**Example 1: Search for Python skills**
```
User: I need help with Python testing
Assistant: [Searches database and shows results]
1. pytest-helper (by python-community)
   ⭐ 1,250 stars | 🔀 342 forks
   📝 Helps write and run pytest tests with fixtures and assertions...
   🔗 https://github.com/python-community/pytest-helper

User: Install the first one
Assistant: [Downloads and installs skill, shows configuration guide]
```

**Example 2: Search by author**
```
User: Show me skills by pytorch
Assistant: [Searches and displays PyTorch organization skills]
```

**Example 3: Search by functionality**
```
User: Find skills for code review
Assistant: [Searches for code review related skills]
```

## Commands

The skill responds to natural language requests like:
- "Find skills for [topic]"
- "Search for [keyword] skills"
- "Show me skills by [author]"
- "I need help with [task]"
- "Install skill number [N]"
- "Install [skill-name]"

## Notes

- Skills are installed to `~/.claude/skills/[skill-name]/SKILL.md`
- After installation, restart Claude Code to load the new skill
- The database includes skills with GitHub stats (stars, forks) for quality reference
- Search results are ranked by relevance and popularity

## Requirements

- Node.js runtime
- Internet connection for downloading skills from GitHub
- Skills database file (`all_skills_with_cn.json`)

## Database Statistics

- Total Skills: 31,767
- Skills with Chinese translations: 31,752 (99.95%)
- Skills from diverse authors and organizations
- Regular updates from GitHub repositories

---

**Created**: 2025-12-26
**Version**: 1.0.0

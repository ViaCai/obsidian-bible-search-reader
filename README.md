# Bible Search and Reader

> An Obsidian plugin for local Bible Markdown document search, reading, and projection.

## Features

### Bible Search
- **Search types**: Theme, Outline, Verse (multi-selectable)
- **Search scope**: Entire Bible, Single book, Multiple books
- **Search syntax**:
  - Verse references: `Gal1:1`, `Luke1:1-3`, `Matt1:1-2:5`
  - Keyword search: multiple words separated by spaces/commas
  - Mixed search: combine verse references and keywords
- **Results**: Paginated display (50 per page), keyword highlighting
- **Selection**: Click to select/unselect, numbered order (1, 2, 3...)
- **Side-by-side tag**: Mark items for mixed projection grouping

### Projection Modes
- **Focus mode**: One item per slide, navigate with arrow keys
- **Parallel mode**: All items on one slide
- **Mixed mode**: Grouped by side-by-side tags, one group per slide
- **Controls**: Arrow keys / scroll wheel for navigation, +/- for font size, T for theme toggle, ESC to exit

### Bible Reader
- **Book browsing**: Old Testament / New Testament grid, click to enter chapter selection
- **Chapter reading**: Display themes, outlines, and verses with adjustable font size
- **Quick jump**: Book dropdown + Chapter dropdown for instant navigation
- **Chapter navigation**: Previous / Next chapter buttons
- **Selection**: Click cards to select/unselect, cumulative numbering
- **Copy functions**: Copy verses / copy outlines / copy selected items
- **Projection**: Focus projection / Parallel projection (current chapter only)

## Installation

### From Obsidian Community Plugins (Recommended)

1. Open Obsidian Settings → Community Plugins
2. Turn on "Safe mode" off if needed
3. Click "Browse" and search for "Bible Search and Reader"
4. Click "Install" then "Enable"

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/ViaCai/obsidian-bible-search-reader/releases)
2. Extract the files to your vault's `.obsidian/plugins/bible-search-reader/` folder
3. In Obsidian Settings → Community Plugins, enable "Bible Search and Reader"

## Bible Documents

This plugin requires Bible Markdown documents in the specific format described above.

You can download the sample Bible documents here:

- [Download Bible Documents (ZIP)](https://github.com/ViaCai/obsidian-bible-search-reader/releases/download/1.0.0/bible-documents.zip)

After downloading, extract the files to your vault and configure the paths in the plugin settings.

## Setup

1. Open Obsidian Settings → Community Plugins → Bible Search and Reader
2. Set **Old Testament Path**: the folder containing Old Testament Markdown files (e.g., `Bible/Old Testament`)
3. Set **New Testament Path**: the folder containing New Testament Markdown files (e.g., `Bible/New Testament`)

## Document Format Requirements

### File Naming
Recommended format: `Number. Book Name.md`

- Old Testament examples: `01. Genesis.md`, `37. Haggai.md`
- New Testament examples: `40. Matthew.md`, `48. Galatians.md`
- Old and New Testament files should be in separate folders

### File Content Format

```markdown
---
title:
author:
---
> **Theme: Book theme content**

# Book Name Chapter 1

> I. Outline content 1:1-5

BookShortName1:1 Verse content
BookShortName1:2 Verse content

# Book Name Chapter 2

> II. Outline content 2:1-10

BookShortName2:1 Verse content
```

### Format Rules
1. **Theme**: `> **Theme: theme content**`
2. **Outline**: `> outline content` (starts with `>` but does not contain "Theme")
3. **Verse**: `BookShortNameChapter:Verse Verse content`, e.g., `Gal1:1 Paul, an apostle...`
4. **Chapter title**: `# Book Name Chapter X` (used to identify current chapter)

## Usage

### Search
1. Click the 📖 icon in the left sidebar or run the command "Open Bible Search"
2. In the "Bible Search" tab:
   - Select search types (Theme / Outline / Verse)
   - Select search scope (All / Single book / Multiple books)
   - Enter search query and click "🔍 Search"
3. Click cards to select/unselect
4. Click "Focus Projection", "Parallel Projection", or "Mixed Projection"

### Reading
1. Switch to the "Bible Reader" tab
2. Click a book abbreviation → click a chapter number → read content
3. Use top buttons for select all, copy, projection, etc.
4. Use "Quick Jump" dropdowns to switch books and chapters instantly

### Search Syntax Examples

| Input | Description |
|-------|-------------|
| `Gal1:1` | Galatians 1:1 |
| `Luke1:1-3` | Luke 1:1 to 1:3 |
| `Matt1:1-2:5` | Matthew 1:1 to 2:5 |
| `grace love` | Verses containing both "grace" and "love" |
| `Luke2:1, grace` | Luke 2:1, plus verses containing "grace" |

## Notes

1. Ensure Bible documents are stored according to the naming and format requirements
2. The plugin loads Bible data on startup; first load may take some time
3. After modifying Bible documents, reload the search view or restart Obsidian to update data
4. Supports both desktop and mobile platforms

## License

MIT License


---

## ☕ 如果觉得这个插件对你有帮助，可以给予支持，以便继续开发。

加6:6 只是那在话语上受教的，当与施教的人共同分享一切的美物。

<img src="https://github.com/ViaCai/bitiful-helper/blob/main/images/wechat-pay.png" alt="微信收款码" width="240" />




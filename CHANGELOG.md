# Changelog

## [1.0.2] - 2026-07-31

### Fixed
- **Reader selection persistence**: Chapter selections now clear when switching to a different chapter.
- **Verse reference parsing engine completely rewritten**:
  - Supports Chinese numeral + Arabic numeral mixed format: `太一1`, `太十一2`, `约壹一1`, `约贰一1`, `约叁一1`
  - Supports colon format: `太1:1`
  - Supports range with `~` or `-`: `太一1~5`, `太一1-二1`, `太1:1~2:1`
  - Supports continuation references (book prefix omitted after comma): `约一1,十四7~21,23` → John 1:1, John 14:7-21, John 14:23
  - Supports mixed continuation: `三34` → chapter 3 verse 34, `十六13~15` → chapter 16 verses 13-15
- **Fixed infinite search hang**: Pure numeric strings like `21` are no longer incorrectly split into `2:1`.
- **John 2 & 3 John alias support**: Document formats `约二1:1` and `约三1:1` are now correctly mapped to `约贰` and `约叁`.

### Added
- **Keyword matching modes**:
  - Space / 顿号 (` `、`、`): AND mode, ignore order
  - Comma (`，`、` ,`): AND mode, **preserve input order** in verse content
  - Semicolon (`；`、`;`): OR mode, results sorted by keyword order
  - Period (`。`、`.`): OR mode, results sorted by verse order
- **Focus mode**: One-click collapse of search/reader control panels to maximize content space.
- **Book selector grid**: Multi-book search scope now uses a visual grid of all 66 books.

---

## [1.0.1] - 2026-07-25

### Fixed
- Minor bug fixes and stability improvements.

---

## [1.0.0] - 2026-07-20

### Added
- Initial release.
- Bible search with theme, outline, and verse types.
- Full-screen projection with focus, parallel, and mixed modes.
- Bible reader with book/chapter navigation.

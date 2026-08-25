---
name: professional-research-docx-writer
description: >-
  Extracts web/academic data, synthesizes structured academic arguments, processes
  local documents, and generates natively styled, production-ready .docx academic
  manuscripts. Use when the user asks for a research paper, thesis note, academic
  DOCX, APA/IEEE manuscript, or "research docx writer".
---

# Skill Name: Professional Research Docx Writer

## Description

Extracts web/academic data, synthesizes structured academic arguments, processes local documents, and generates natively styled, production-ready .docx academic manuscripts.

## Capabilities

* **Literature Extraction**: Parse local `.pdf`, `.txt`, and `.xlsx` raw notes.
* **Citation Management**: Format references cleanly using APA 7th or IEEE guidelines.
* **Native Document Generation**: Create and style paragraphs, tables, headers, and footnotes without needing MS Word installed.
* **Figure Integration**: Embed high-resolution PNG plates with captions; never rely on GIF/Mermaid inside the uploaded DOCX.
* **Dummy-data discipline**: Prefer illustrative/dummy operational examples unless the user explicitly authorizes proprietary disclosure.

## Requirements

* Executable Environment: Python 3.10+ with `python-docx` (project venv `.venv-research-docx` preferred)
* Input Context: Sourced via `@` symbols in the Cursor chat interface
* Optional: `pandas`, `pypdf`, `openpyxl`, `requests` for literature/data ingestion

## Academic Defaults (Grade A)

Unless the user overrides:

| Property | Value |
|---|---|
| Body font | Times New Roman 12 pt |
| Line spacing | 1.5 |
| Margins | 1 inch (2.54 cm) all sides |
| Alignment | Justified body |
| Title | Centered, bold |
| Headings | Numbered hierarchical (1, 1.1, 1.1.1) |
| Citations | IEEE numeric `[n]` inline + numbered References, **or** APA 7th if requested |
| Structure | Abstract → Introduction → Literature Review → Methodology → Results/Analysis → Discussion → Conclusion → References |

## Execution Rules

1. Do **not** dump the full manuscript as chat markdown when the user asks for a DOCX.
2. Write a Python script using `python-docx` with explicit styling properties.
3. Execute the script in the terminal; verify the `.docx` exists and reports size.
4. Prefer outline approval for large papers; for iterative upgrades of an existing paper, regenerate the DOCX directly.
5. Every empirical/illustrative claim should carry an inline citation or an explicit “illustrative/dummy” qualifier.
6. Keep companion Markdown/GIF assets unless asked to delete them.
7. Prefer `.docx` only; remove legacy `.doc` if regenerating unless the user requests `.doc`.

## Workflow

1. Provide context (`@files`, figures, notes)
2. Outline (optional for large new papers)
3. Generate + execute Python compiler script
4. Verify output path and figure embedding

## Output Location (this repo)

Default manuscript path unless overridden:

`Documents/linkedin-articles/Your-Framework-Is-Old-Your-Architecture-Shouldnt-Be.docx`

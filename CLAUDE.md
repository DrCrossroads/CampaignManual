# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

NovaradLearn is a centralized documentation repository for Novarad healthcare products (PACS, RIS, Object Store). This is a documentation-only repository with no application code - all content is in Markdown format with automated quality validation.

## Common Commands

### Development and Testing
```bash
# Install dependencies
npm install

# Run all validation checks (equivalent to running tests)
npm run validate

# Serve documentation locally for preview
npm run dev                    # Starts http-server on port 8080
npm run serve                  # Alternative to dev

# Individual validation commands
npm run lint:markdown          # Check markdown syntax
npm run lint:markdown:fix      # Auto-fix markdown issues
npm run spell-check           # Spell check all .md files
npm run check-links           # Validate all links
npm run validate-structure    # Check required files exist
npm run optimize-images       # Optimize image assets
```

### Quality Validation
The repository enforces strict quality standards through automated checks:
- Markdown linting (markdownlint-cli2)
- Spell checking (cspell with custom medical/tech dictionary)
- Link validation (markdown-link-check)
- Image optimization and validation
- Documentation structure validation

## Architecture and Structure

### Documentation Hierarchy
```
docs/
├── pacs/              # PACS product documentation
├── ris/               # RIS product documentation  
├── object-store/      # Object Store documentation
├── shared/            # Cross-product documentation
└── assets/images/     # Organized by product subdirectories
```

### Required Files Per Product
Each product directory must contain:
- `getting-started.md` - Introduction and basic setup
- `user-manual.md` - Comprehensive user guide
- `admin-guide.md` - Administrative configuration
- `api-reference.md` (object-store only)
- `troubleshooting.md` (pacs only)
- `integration-guide.md` (ris only)

### Configuration Files
- `.markdownlint.json` - Markdown linting rules (allows specific HTML elements, disables line length limits)
- `.cspell.json` - Spell check dictionary with healthcare/tech terms
- `scripts/validate-structure.js` - Custom validation for required files and image references
- `scripts/optimize-images.js` - Image optimization utilities

## Documentation Standards

### File Naming
- Use lowercase with hyphens: `user-manual.md`
- Be descriptive but concise
- Follow consistent naming patterns across products

### Markdown Conventions
- Use `#` for document title (H1) - only once per document
- Use `##` for main sections, `###` for subsections
- Always specify language in code blocks for syntax highlighting
- Use relative paths for internal links
- Include meaningful alt text for all images
- Use callout boxes with `> **Note**:`, `> **Warning**:`, `> **Important**:`

### Image Guidelines
- PNG for screenshots, SVG for diagrams, JPG for photos
- Max 800px width for screenshots
- Store in `docs/assets/images/[product-name]/`
- Use descriptive filenames: `pacs-login-screen.svg`
- Always include alt text for accessibility

## Validation Requirements

Before any changes are committed, all validation checks must pass:
1. Markdown syntax must be valid
2. All links must be accessible
3. No spelling errors (custom dictionary includes medical/tech terms)
4. All images must exist and have alt text
5. Required files must be present for each product
6. Images should be optimized for web delivery

The validation pipeline will automatically run on pull requests and reject changes that don't meet quality standards.
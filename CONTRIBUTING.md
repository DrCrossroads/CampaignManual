# Contributing to NovaradLearn 🤝

Thank you for your interest in contributing to NovaradLearn! This guide will help you understand our documentation standards and contribution process.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Documentation Standards](#-documentation-standards)
- [Writing Guidelines](#-writing-guidelines)
- [Markdown Conventions](#-markdown-conventions)
- [Image and Asset Guidelines](#-image-and-asset-guidelines)
- [Review Process](#-review-process)
- [Quality Checks](#-quality-checks)

## 🚀 Getting Started

1. **Fork the Repository**: Create a fork of this repository to your GitHub account
2. **Clone Locally**: Clone your fork to your local development environment
3. **Create a Branch**: Create a feature branch for your documentation changes
4. **Make Changes**: Follow our standards below when creating or updating documentation
5. **Test Locally**: Run the validation tools locally before submitting
6. **Submit PR**: Create a pull request with a clear description of your changes

## 📖 Documentation Standards

### File Naming Conventions

- Use lowercase with hyphens for file names: `user-manual.md`
- Be descriptive but concise: `pacs-installation-guide.md`
- Use consistent naming across products:
  - `getting-started.md` - Introduction and basic setup
  - `user-manual.md` - Comprehensive user guide
  - `admin-guide.md` - Administrative tasks and configuration
  - `api-reference.md` - API documentation (where applicable)
  - `troubleshooting.md` - Common issues and solutions

### Directory Structure

```text
docs/
├── [product-name]/
│   ├── getting-started.md
│   ├── user-manual.md
│   ├── admin-guide.md
│   ├── troubleshooting.md
│   └── advanced/          # Advanced topics
├── shared/                # Cross-product documentation
│   ├── glossary.md
│   ├── common-procedures.md
│   └── system-requirements.md
└── assets/
    ├── images/
    │   └── [product-name]/
    └── downloads/
```

## ✍️ Writing Guidelines

### Tone and Style

- **Professional yet approachable**: Clear, concise, and helpful
- **User-focused**: Write from the user's perspective
- **Action-oriented**: Use active voice and clear instructions
- **Consistent terminology**: Use the same terms throughout all documentation

### Content Structure

1. **Start with an overview**: Brief introduction explaining what the document covers
2. **Use clear headings**: Hierarchical structure with descriptive headings
3. **Step-by-step instructions**: Number steps for procedures
4. **Include examples**: Provide concrete examples and screenshots
5. **End with next steps**: Link to related documentation

### Writing Best Practices

- Use second person ("you") for instructions
- Write in present tense
- Use bullet points for lists of related items
- Use numbered lists for sequential steps
- Keep paragraphs short (3-4 sentences max)
- Use meaningful link text (avoid "click here")

## 📝 Markdown Conventions

### Headers

```markdown
# Document Title (H1) - Use only once per document
## Main Sections (H2)
### Subsections (H3)
#### Details (H4) - Avoid going deeper than H4
```

### Code Blocks

Always specify the language for syntax highlighting:

```markdown
\`\`\`bash
npm install
\`\`\`

\`\`\`javascript
const config = { api: 'https://api.example.com' };
\`\`\`
```

### Links

- Use descriptive link text: `[PACS User Manual](docs/pacs/user-manual.md)`
- For external links, include the domain: `[Microsoft Docs](https://docs.microsoft.com)`
- Use relative paths for internal links

### Tables

```markdown
| Feature | PACS | RIS | Object Store |
|---------|------|-----|--------------|
| Storage | ✅   | ✅  | ✅           |
| Search  | ✅   | ✅  | ❌           |
```

### Callout Boxes

Use these for important information:

```markdown
> **Note**: This is a general note or tip

> **Warning**: This is a warning about potential issues

> **Important**: This is critical information
```

## 🖼️ Image and Asset Guidelines

### Image Standards

- **Format**: Use PNG for screenshots, SVG for diagrams, JPG for photos
- **Size**: Optimize images (max 800px width for screenshots)
- **Naming**: Use descriptive names: `pacs-login-screen.png`
- **Alt text**: Always include meaningful alt text for accessibility

### File Organization

```text
docs/assets/images/
├── pacs/
│   ├── screenshots/
│   ├── diagrams/
│   └── icons/
├── ris/
└── object-store/
```

### Image Usage

Use this markdown syntax for images (path relative to the markdown file):

```markdown
![Alt text describing the image](docs/assets/images/pacs/pacs-login-screen.svg)
```

Example format for image paths:

```text
docs/assets/images/[product-name]/descriptive-filename.svg  (from root)
../assets/images/[product-name]/descriptive-filename.svg    (from docs/ folder)
```

## 🔍 Review Process

### Pull Request Requirements

1. **Clear Title**: Descriptive PR title explaining the change
2. **Description**: Detailed description of what was changed and why
3. **Testing**: Confirm all validation checks pass
4. **Screenshots**: Include before/after screenshots for UI changes
5. **Related Issues**: Link to any related GitHub issues

### Review Criteria

- **Accuracy**: Information is correct and up-to-date
- **Clarity**: Content is easy to understand
- **Completeness**: All necessary information is included
- **Consistency**: Follows established style and conventions
- **Quality**: Free of spelling and grammatical errors

## ✅ Quality Checks

### Automated Validation

Our CI/CD pipeline automatically checks:

- **Markdown Linting**: Ensures proper markdown syntax
- **Spell Check**: Catches spelling errors
- **Link Validation**: Verifies all links work
- **Image Optimization**: Checks image sizes and formats
- **Style Guide Compliance**: Ensures consistent formatting

### Local Testing

Before submitting a PR, you can run these checks locally:

```bash
# Install dependencies
npm install

# Run all checks
npm run validate

# Individual checks
npm run lint:markdown
npm run spell-check
npm run check-links
npm run optimize-images
```

## 🛠️ Tools and Resources

### Recommended Editors

- **VS Code** with Markdown extensions
- **Typora** for WYSIWYG editing
- **GitBook** for collaborative editing

### Useful Extensions (VS Code)

- Markdown All in One
- markdownlint
- Code Spell Checker
- Markdown Preview Enhanced

## 🆘 Getting Help

If you need assistance:

1. **Check existing documentation** in the `docs/shared/` folder
2. **Search GitHub issues** for similar questions
3. **Create a new issue** with the "documentation" label
4. **Join our discussions** in GitHub Discussions

## 📜 License

By contributing to this repository, you agree that your contributions will be licensed under the same license as the project.

---

**Questions?** Feel free to reach out to the documentation team or create an issue!

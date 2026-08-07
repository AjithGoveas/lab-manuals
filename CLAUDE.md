# Agent Developer Handbook

This repository contains the source code for the **Deep Learning Systems Laboratory Manual** web application. Follow these instructions and guidelines when extending or maintaining the codebase.

## 🚀 Development Operations

### Astro Dev Server
Always run the Astro development server in background mode on Windows systems:
```bash
astro dev --background
```

To manage the background server:
* Check Status: `astro dev status`
* View Logs: `astro dev logs`
* Terminate Server: `astro dev stop`

### Project Build
Before submitting changes, verify that the production build compiles cleanly:
```bash
npm run build
```

---

## 🎨 Theme & Design Tokens

The site features a custom **Warm Clay** aesthetic. When creating new layouts or components, strictly adhere to the following tokens:

### Custom CSS Variables (`src/styles/global.css`)
* **Background**: `--background` (`#e7e5e4` clay in light, `#1a1614` in dark)
* **Accent/Primary**: `--primary` (`#6366f1` / `#818cf8` Indigo)
* **Cards**: `--card` (`#f5f5f4`)
* **Borders**: `--border` (`#d6d3d1`)
* **Radius**: `--radius: 1.25rem` (all cards and panels must use `rounded-2xl` or `rounded-[var(--radius)]`)

### Typography
* **Headers & Cards**: `font-sans` (`Plus Jakarta Sans`)
* **Academic prose / slots**: `font-serif` (`Lora`)
* **Code logs & shell outputs**: `font-mono` (`Roboto Mono`)

---

## 📝 Documenting Experiments

All experiments are structured as folder collections under `src/content/experiments/<experiment-id>/index.md`.

### Front Matter Schema
Every index markdown file must strictly implement the schema defined in `src/content.config.ts`:
```yaml
experimentNumber: number
title: "Title of Experiment"
description: "Brief summary description"
tags: ["Tag1", "Tag2"]
dataset: "Dataset Name"
notebookUrl: "https://colab.research.google.com/..."
vivaQuestions:
  - question: "Concept Question?"
    answer: "Expected brief response."
metrics:
  - epoch: 1
    trainLoss: 0.1234
    testAccuracy: 98.50
```

### Writing Math Equations
The site supports LaTeX rendering using KaTeX auto-render capabilities.
* Use double dollar signs for display equations: `$$\mathcal{L} = -\sum y \log(\hat{y})$$`
* Use single dollar signs for inline variables: `$W_x$` or `$h_{t-1}$`

---

## 🔍 Useful Documentation Links
* [Astro Routing Guide](https://docs.astro.build/en/guides/routing/)
* [Astro Components Guide](https://docs.astro.build/en/basics/astro-components/)
* [Content Collections in Astro](https://docs.astro.build/en/guides/content-collections/)

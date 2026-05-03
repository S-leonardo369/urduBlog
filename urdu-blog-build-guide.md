# Building Your Urdu Blog: Complete Step-by-Step Guide

A roadmap from zero to a deployed Urdu blog using Claude.ai (for design) and Claude Code (for building).

---

## Stage 0: Understand the Stack You're About to Build

Before any prompts, here's what you're actually making and why these choices matter for **Urdu**:

- **Framework: Astro** — Best choice for a personal blog. It's fast, static (no server costs), and posts are just Markdown files (`.md`) you write and commit. Easier than Next.js or WordPress for your use case.
- **RTL (Right-to-Left)**: Urdu reads right-to-left. The entire layout — navigation, headings, paragraphs, images — must mirror. This is `dir="rtl"` on the HTML root, not just CSS tweaks.
- **Font: Noto Nastaliq Urdu** (free from Google Fonts) or **Mehr Nastaliq Web**. Nastaliq script needs ~2× the line-height of English (use `line-height: 2.2` minimum) and slightly larger font sizes (18–20px body text).
- **Hosting: Vercel or Netlify** — both free, both deploy from GitHub in one click.

Keep this open in another tab — you'll reference it.

---

## Stage 1: Gather Inspiration (30–60 minutes)

Spend real time here. The clearer your visual taste, the better Claude's design output.

### Where to look

**General blog/editorial design:**
- **Awwwards.com** → search "blog" or "editorial"
- **Godly.website** → curated, very high taste
- **Land-book.com** → real-world landing pages and blogs
- **SiteInspire.com** → filter by category "Editorial" or "Blog"
- **Httpster.net** → fresh, less polished, more personality
- **Minimal.gallery** → if you want clean and quiet

**Specifically Urdu/Arabic-script editorial design (very important):**
- **Aljazeera.net/ar** — gold standard for Arabic/RTL editorial layout
- **Bbc.com/urdu** — solid Urdu typography baseline
- **Rekhta.org** — Urdu poetry site, beautiful Nastaliq treatment
- Look at **Iranian magazine/newspaper websites** — Persian uses similar script and they have strong design culture

### What to collect

Open a Google Doc or Notion page. For every site you like, screenshot:
1. The **homepage** (how posts are listed)
2. A **single post page** (how reading feels)
3. The **navigation** style
4. Any **typography detail** that stands out

Write 1–2 words next to each: *"clean," "magazine-y," "warm," "minimal," "high contrast,"* etc. You're building a vocabulary.

Pick **3–5 favorite references** total. More than that and Claude gets confused.

---

## Stage 2: Design Phase — Use Claude.ai

Open **claude.ai** in your browser. You'll generate clickable HTML mockups (artifacts) before writing any real code. This lets you iterate on design cheaply.

### Prompt 2.1 — Generate the homepage mockup

Paste this into a fresh Claude.ai conversation. **Replace the bracketed parts** with your own answers.

```
I'm designing a personal blog for writing in URDU (right-to-left, Nastaliq script).
Create a high-quality HTML mockup of the HOMEPAGE as an artifact.

ABOUT THE BLOG:
- Author: [your name in English + Urdu, e.g. "Ali Khan / علی خان"]
- Topic: [what you'll write about — e.g. "personal essays on philosophy, books, and Lahore"]
- Tone: [pick: warm and personal / serious and editorial / minimal and quiet / bold and modern]

DESIGN REFERENCES I LIKE:
1. [reference 1 + what you like about it, e.g. "Aljazeera Arabic — the way headlines breathe"]
2. [reference 2]
3. [reference 3]

TECHNICAL REQUIREMENTS:
- Full RTL layout (dir="rtl" on html, everything mirrored)
- Use Noto Nastaliq Urdu from Google Fonts for Urdu text
- Use Inter or similar sans-serif for any English/numbers
- Line-height for Urdu paragraphs: minimum 2.2
- Body Urdu text size: 18–20px
- Generous whitespace — Nastaliq script needs room to breathe

HOMEPAGE SHOULD CONTAIN:
- Site header with name in Urdu (large, beautiful) and a small English transliteration
- A short Urdu intro/tagline (1 line)
- A list of 5 fake blog posts. Each post card shows:
  - Urdu title (large)
  - Urdu date (e.g. ۲۰ مئی ۲۰۲۵ — use Urdu numerals)
  - 2-line Urdu excerpt
  - Reading time in Urdu
- Footer with social links (Twitter/X, Instagram, RSS)

Use realistic Urdu lorem text (not English placeholders). Make it feel like a real magazine.
Show me the artifact.
```

### Prompt 2.2 — Iterate on the design

Look at the artifact carefully. Then send follow-ups like:

```
- Make the header smaller and the post titles larger
- Try a serif/decorative font for the site name only
- Add more breathing room between posts
- Try a warmer background color (cream/off-white instead of pure white)
- Show me a dark mode version
```

Iterate until you genuinely love it. **Don't move on too early** — every fix you make here saves three later.

### Prompt 2.3 — Generate the single-post page

```
Now design the SINGLE POST PAGE in the same style as the homepage we just made.

It should contain:
- Post title (very large, beautiful)
- Date and reading time
- A long-form Urdu article body (use realistic Urdu lorem ipsum, ~6 paragraphs,
  with some H2 subheadings and at least one blockquote)
- Comfortable reading width (max ~680px content column)
- A "next post / previous post" section at the bottom
- Back-to-home link

Reading is the priority. Type should feel calm and inviting.
Same RTL, same Noto Nastaliq Urdu, same line-height ≥ 2.2.
```

### Prompt 2.4 — Generate an "About" page mockup

```
Design the ABOUT page in the same visual language.
Include: a short Urdu bio, photo placeholder, list of where to find me elsewhere,
and a "subscribe to my posts" email signup. Keep it personal, not corporate.
```

### What to save before moving on

When you're happy with all three pages, ask Claude.ai:

```
Summarize the design system we built into a single document I can hand to a developer:
- Color palette (with hex codes)
- Typography scale (font families, sizes, line-heights, weights)
- Spacing scale
- Component patterns (post card, navigation, blockquote, etc.)
- Any specific RTL or Urdu rules
Format as Markdown.
```

**Save this output as `design-system.md`.** This is the brief you'll feed to Claude Code. Also save the HTML of your favorite mockup as `homepage-mockup.html` — Claude Code will read it directly.

---

## Stage 3: Set Up Claude Code

### 3.1 — Install prerequisites

You need these on your computer first:

1. **Node.js 18+** — download from [nodejs.org](https://nodejs.org). Pick the LTS version.
2. **Git** — [git-scm.com](https://git-scm.com)
3. **A GitHub account** — [github.com](https://github.com)
4. **A code editor** — [VS Code](https://code.visualstudio.com) is the easiest

Verify Node is installed by opening Terminal (Mac) or PowerShell (Windows) and running:
```bash
node --version
```
If it prints `v18.x.x` or higher, you're good.

### 3.2 — Install Claude Code

In the terminal, run:
```bash
npm install -g @anthropic-ai/claude-code
```

Then verify:
```bash
claude --version
```

> **Windows note:** If `npm install` gives you trouble, the recommended path is to use WSL (Windows Subsystem for Linux) or the native installer at `https://claude.ai/install.ps1`. Check the official docs at `docs.claude.com/en/docs/claude-code` for the latest install instructions.

### 3.3 — Create your project folder

```bash
mkdir my-urdu-blog
cd my-urdu-blog
```

Now copy your `design-system.md` and `homepage-mockup.html` files into this folder. Claude Code will read them.

### 3.4 — Start Claude Code

Inside that folder, run:
```bash
claude
```

It'll log you in (one-time browser auth) and drop you into an interactive session.

---

## Stage 4: Build the Blog with Claude Code

You are now talking to Claude Code in your terminal. It can read files, write files, run commands, and ask before doing anything destructive.

### Prompt 4.1 — Initial scaffolding

Paste this as your first message:

```
I'm building a personal Urdu blog. Here's the situation:

1. I've put two files in this folder:
   - design-system.md — the design brief (colors, fonts, spacing, component rules)
   - homepage-mockup.html — a static mockup showing exactly how the homepage should look

Please read both files first. Then build me a real Astro blog that matches the
mockup pixel-for-pixel.

REQUIREMENTS:
- Framework: Astro (latest version)
- Content: blog posts written as Markdown files in /src/content/posts/
- Language: 100% Urdu UI. The whole site is RTL. Use dir="rtl" and lang="ur"
  on the html element. Mirror all layout (logos right, nav left, etc.)
- Fonts: Noto Nastaliq Urdu from Google Fonts for Urdu, Inter for any English/numbers
- Typography: line-height 2.2 minimum for Urdu paragraphs, body size 18px
- Pages I need:
  * Homepage (/) — list of posts, matches mockup
  * Single post page (/posts/[slug]) — comfortable reading layout
  * About page (/about)
  * RSS feed (/rss.xml)
- Dark mode toggle (with Urdu labels: روشن / تاریک)
- Reading time calculator that outputs in Urdu numerals (۱، ۲، ۳)
- Dates displayed in Urdu numerals
- Three sample posts in Urdu so I can see it working

Set up the project, install dependencies, and create everything.
Show me what command to run to preview it locally.
```

Claude Code will think, read your files, and start creating. It'll ask permission before installing packages or writing files. **Approve them.** Then it'll tell you to run `npm run dev`.

### 4.2 — Preview locally

When it's done, open another terminal in the same folder and run:
```bash
npm run dev
```

It'll print a local URL (usually `http://localhost:4321`). Open it in your browser. Your blog is alive.

### Prompt 4.3 — Iterate on bugs and polish

Whatever's wrong, just tell Claude Code in plain English. Examples:

```
The Urdu numerals on the dates aren't rendering — they show as English. Fix that.
```
```
The line-height in the post body is too tight. Increase it. Also the post title
on the single-post page should be much larger — closer to 48px on desktop.
```
```
On mobile, the nav bar overlaps the site title. Fix the responsive layout.
```
```
Add a "table of contents" sidebar on long posts that auto-generates from H2/H3 headings.
```

### Prompt 4.4 — Add features one at a time

Don't ask for ten things at once. One feature per prompt:

```
Add a tag system. Each post can have multiple Urdu tags in its frontmatter.
On the homepage, show tags below each post card. Create a /tags/[tag] page that
lists all posts with that tag.
```

```
Add a search box in the header. It should search post titles and content
in Urdu. Use a client-side library like Pagefind or Fuse.js.
```

```
Add an email signup form in the footer. Connect it to Buttondown or Substack
(I'll add my API key to a .env file).
```

---

## Stage 5: Write Your First Real Post

In `/src/content/posts/`, each post is a `.md` file. Format:

```markdown
---
title: "میری پہلی تحریر"
date: 2025-05-03
description: "یہ میرے بلاگ کی پہلی پوسٹ ہے"
tags: ["ذاتی", "تحریر"]
---

یہاں اپنی تحریر لکھیں...

## ذیلی عنوان

مزید پیراگراف۔
```

You can write in any text editor. Save the file, refresh your browser — it appears.

### Prompt 5.1 — Help drafting the writing workflow

```
I want to write posts on my phone too. Set up a workflow where:
1. I can write in any markdown editor on iOS/Android
2. The post syncs to GitHub automatically (e.g. via iA Writer + GitHub, or Obsidian Git)
3. Pushing to GitHub auto-deploys to Vercel

Walk me through it step by step.
```

---

## Stage 6: Deploy to the Internet

### Prompt 6.1 — Push to GitHub and deploy

```
I'm ready to publish. Help me:
1. Initialize a git repository
2. Create a .gitignore
3. Push to a new GitHub repository (I'll create the empty repo first and give you the URL)
4. Then walk me through connecting Vercel to deploy it for free

Also set up so that every time I push a new post to GitHub, Vercel auto-deploys.
```

Claude Code will guide you through each step, including the exact commands.

### 6.2 — Custom domain (optional)

Buy a domain from Namecheap, Cloudflare Registrar, or Porkbun (~$10/year). Then:

```
I bought the domain [yourname.com]. Walk me through pointing it at my Vercel site.
```

---

## Stage 7: Maintenance & Improvement

Come back to Claude Code anytime with prompts like:

```
The site feels slow on 3G. Audit performance and tell me what to fix.
```
```
Add Open Graph images that auto-generate per post with the Urdu title overlaid.
```
```
Add a "now" page (like nownownow.com) where I share what I'm currently doing.
```
```
The Nastaliq font is loading slowly. Self-host it and add font-display: swap.
```

---

## Prompting Principles That Actually Matter

A few things that separate good results from frustrating ones:

1. **Show, don't just tell.** A reference HTML mockup beats 500 words of description. That's why Stage 2 exists.

2. **Specify constraints, not just goals.** "Make it look modern" → bad. "Use a 16px base, 1.5 modular scale, max content width 680px, off-white #FAF8F3 background" → great.

3. **Iterate in small steps.** One change per prompt. If you ask for five things and one breaks, you don't know which.

4. **For Urdu specifically, always re-state RTL and the font.** Models sometimes drift back to LTR defaults when adding new components. A quick "remember this is RTL, use Noto Nastaliq Urdu" header in your prompt prevents this.

5. **Save your design system file and reference it.** Every new feature prompt to Claude Code can start with: *"Following design-system.md, add..."*

6. **When stuck, ask Claude to explain.** "I don't understand why this isn't working — explain the cause in simple terms before fixing it." You'll learn the codebase and prompt better next time.

---

## Quick Reference: What Goes Where

| Task | Tool | Why |
|---|---|---|
| Find inspiration | Awwwards, Godly, Aljazeera Arabic | Visual taste-building |
| Design mockups | Claude.ai (artifacts) | Iterate cheaply on look/feel |
| Document design system | Claude.ai → save as `.md` | Brief for the build |
| Build the actual site | Claude Code (terminal) | Real codebase, real files, real git |
| Write blog posts | Any markdown editor | Just save `.md` files |
| Host & deploy | Vercel + GitHub | Free, auto-deploys on push |

That's the whole pipeline. Good luck — and once it's live, send me the link.

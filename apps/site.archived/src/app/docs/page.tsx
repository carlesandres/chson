import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation | ChSON",
  description: "Learn about ChSON v2 format: anchors, content, labels, and cognitive-friendly cheatsheet design.",
};

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="mt-4">
      {title && (
        <div className="text-xs font-medium text-zinc-500 mb-1">{title}</div>
      )}
      <pre className="overflow-auto rounded-xl border border-black/10 bg-black/[0.04] p-4">
        <code className="font-mono text-[13px]">{children}</code>
      </pre>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 first:mt-0">
      <h2 className="text-xl font-semibold tracking-tight border-b border-black/10 pb-2">{title}</h2>
      <div className="mt-4 space-y-4 text-zinc-700 leading-relaxed">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-zinc-900">{title}</h3>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.03em]">
        ChSON v2 Documentation
      </h1>
      <p className="mt-3 text-zinc-600 text-lg">
        A JSON format for software cheatsheets, designed around how people actually look up information.
      </p>

      {/* Table of Contents */}
      <nav className="mt-6 rounded-xl border border-black/10 bg-white/60 p-4">
        <div className="text-sm font-medium text-zinc-500 mb-2">On this page</div>
        <ul className="space-y-1 text-sm">
          <li><a href="#what-is-chson" className="text-blue-700 hover:text-blue-800">What is ChSON?</a></li>
          <li><a href="#core-concepts" className="text-blue-700 hover:text-blue-800">Core Concepts</a></li>
          <li><a href="#advanced-features" className="text-blue-700 hover:text-blue-800">Advanced Features</a></li>
          <li><a href="#complete-example" className="text-blue-700 hover:text-blue-800">Complete Example</a></li>
          <li><a href="#cli-usage" className="text-blue-700 hover:text-blue-800">CLI Usage</a></li>
          <li><a href="#best-practices" className="text-blue-700 hover:text-blue-800">Best Practices</a></li>
        </ul>
      </nav>

      <Section id="what-is-chson" title="What is ChSON?">
        <p>
          ChSON (Cheatsheet JSON) is a small JSON format for writing software cheatsheets 
          in a consistent, tool-friendly way. The goal is simple: write a cheatsheet once, 
          then consume it anywhere—searchable websites, printable pages, study decks, or 
          personal knowledge bases.
        </p>
        <p>
          The v2 format is designed around <strong>cognitive retrieval theory</strong>: how people 
          actually scan and look up information. When you use a cheatsheet, you typically 
          scan for something you recognize (a command, shortcut, or keyword) to find the 
          information you need.
        </p>
      </Section>

      <Section id="core-concepts" title="Core Concepts">
        <SubSection title="Anchor and Content">
          <p>
            Every cheatsheet entry has two key parts:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>anchor</strong> — The retrieval cue. What you scan for. (command, shortcut, keyword)</li>
            <li><strong>content</strong> — The information you need when you find it. (description, action, result)</li>
          </ul>
          <p>
            Think of it like a dictionary: you scan for the word (anchor) to find its definition (content).
          </p>
          <CodeBlock title="Basic entry">{`{
  "anchor": "git status",
  "content": "Show staged, unstaged, and untracked files."
}`}</CodeBlock>
        </SubSection>

        <SubSection title="Optional Labels">
          <p>
            Sometimes the anchor is cryptic—a keyboard shortcut, obscure command, or symbol. 
            The optional <code className="font-mono bg-black/5 px-1 rounded">label</code> field 
            provides a human-readable description.
          </p>
          <CodeBlock title="Entry with label">{`{
  "anchor": "gg",
  "content": "Jump to visual top of history",
  "label": "Go to start"
}`}</CodeBlock>
          <p>
            Labels are useful for vim commands, keyboard shortcuts, or any anchor that 
            isn&apos;t immediately self-explanatory.
          </p>
        </SubSection>

        <SubSection title="Sections">
          <p>
            Entries are organized into sections, each with a title and optional description.
            Sections group related entries logically—by functionality, context, or workflow.
          </p>
          <CodeBlock title="Section structure">{`{
  "sections": [
    {
      "title": "Navigation",
      "description": "Moving around the interface.",
      "entries": [
        { "anchor": "ctrl + n", "content": "Next item" },
        { "anchor": "ctrl + p", "content": "Previous item" }
      ]
    }
  ]
}`}</CodeBlock>
        </SubSection>
      </Section>

      <Section id="advanced-features" title="Advanced Features">
        <SubSection title="Retrieval Direction">
          <p>
            The <code className="font-mono bg-black/5 px-1 rounded">retrievalDirection</code> field 
            describes how users typically scan the cheatsheet:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>&quot;mechanism-to-meaning&quot;</strong> — Users scan by command/syntax to find what it does. 
              Most cheatsheets work this way. <em>&quot;What does <code>git rebase -i</code> do?&quot;</em>
            </li>
            <li>
              <strong>&quot;intent-to-mechanism&quot;</strong> — Users scan by goal to find how to do it. 
              Reverse lookups. <em>&quot;How do I squash commits?&quot;</em>
            </li>
          </ul>
          <CodeBlock>{`{
  "retrievalDirection": "mechanism-to-meaning"
}`}</CodeBlock>
        </SubSection>

        <SubSection title="Custom Column Labels">
          <p>
            By default, renderers display &quot;Anchor&quot; and &quot;Content&quot; as column headers. 
            You can customize these with <code className="font-mono bg-black/5 px-1 rounded">anchorLabel</code> and{" "}
            <code className="font-mono bg-black/5 px-1 rounded">contentLabel</code>.
          </p>
          <CodeBlock title="Keyboard shortcuts cheatsheet">{`{
  "anchorLabel": "Shortcut",
  "contentLabel": "Action"
}`}</CodeBlock>
          <CodeBlock title="Command reference cheatsheet">{`{
  "anchorLabel": "Example",
  "contentLabel": "Description"
}`}</CodeBlock>
          <p>
            This makes the rendered output more intuitive for the specific type of cheatsheet.
          </p>
        </SubSection>

        <SubSection title="Metadata">
          <p>
            The optional <code className="font-mono bg-black/5 px-1 rounded">metadata</code> field 
            holds custom key-value pairs for tooling, categorization, or attribution.
          </p>
          <CodeBlock>{`{
  "metadata": {
    "homepage": "https://atuin.sh/",
    "category": "cli",
    "author": "Your Name"
  }
}`}</CodeBlock>
        </SubSection>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <p>
          Here&apos;s a real-world example: an{" "}
          <Link href="/cheatsheets/atuin/keybindings" className="text-blue-700 hover:text-blue-800">
            Atuin keybindings cheatsheet
          </Link>{" "}
          demonstrating the v2 format with custom labels, section descriptions, and cryptic 
          shortcuts that benefit from human-readable labels.
        </p>
        <CodeBlock>{`{
  "$schema": "https://chson.dev/schema/v2/chson.schema.json",
  "title": "Atuin Keybindings",
  "version": "18.x",
  "publicationDate": "2026-02-15",
  "description": "Keyboard shortcuts for Atuin's interactive shell history search UI.",
  "retrievalDirection": "mechanism-to-meaning",
  "anchorLabel": "Shortcut",
  "contentLabel": "Action",
  "metadata": {
    "homepage": "https://atuin.sh/",
    "category": "cli"
  },
  "sections": [
    {
      "title": "Navigation & Selection",
      "entries": [
        {
          "anchor": "enter",
          "content": "Execute selected item"
        },
        {
          "anchor": "ctrl + c / ctrl + d / ctrl + g / esc",
          "content": "Cancel search and return to shell",
          "label": "Cancel"
        },
        {
          "anchor": "alt + 1 to alt + 9",
          "content": "Select item by number shown next to it",
          "label": "Quick select"
        }
      ]
    },
    {
      "title": "Vim Mode - Scrolling",
      "description": "Normal mode scrolling commands.",
      "entries": [
        {
          "anchor": "gg",
          "content": "Jump to visual top of history",
          "label": "Go to start"
        },
        {
          "anchor": "G",
          "content": "Jump to visual bottom of history"
        }
      ]
    }
  ]
}`}</CodeBlock>
        <p className="mt-4">
          <Link 
            href="/cheatsheets/atuin/keybindings" 
            className="text-blue-700 hover:text-blue-800 font-medium"
          >
            View the full Atuin cheatsheet →
          </Link>
        </p>
      </Section>

      <Section id="cli-usage" title="CLI Usage">
        <p>
          The ChSON CLI validates files against the schema and renders them to Markdown.
        </p>

        <SubSection title="Validate a cheatsheet">
          <CodeBlock>{`node packages/chson-cli/src/chson.js validate path/to/file.chson.json`}</CodeBlock>
          <p>
            Validates against the v2 schema (auto-detected from the <code className="font-mono bg-black/5 px-1 rounded">$schema</code> field).
          </p>
        </SubSection>

        <SubSection title="Render to Markdown">
          <CodeBlock>{`node packages/chson-cli/src/chson.js render markdown path/to/file.chson.json`}</CodeBlock>
          <p>
            Outputs a 2-column Markdown table using the cheatsheet&apos;s column labels.
          </p>
        </SubSection>

        <SubSection title="Validate all cheatsheets">
          <CodeBlock>{`npm run validate`}</CodeBlock>
        </SubSection>
      </Section>

      <Section id="best-practices" title="Best Practices">
        <SubSection title="When to use labels">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Keyboard shortcuts (<code className="font-mono bg-black/5 px-1 rounded">ctrl + shift + p</code>)</li>
            <li>Vim/editor commands (<code className="font-mono bg-black/5 px-1 rounded">gg</code>, <code className="font-mono bg-black/5 px-1 rounded">dd</code>)</li>
            <li>Abbreviated commands (<code className="font-mono bg-black/5 px-1 rounded">git stash pop</code> might need context)</li>
            <li>Any anchor that isn&apos;t immediately clear to your target audience</li>
          </ul>
        </SubSection>

        <SubSection title="Choosing retrieval direction">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use <strong>&quot;mechanism-to-meaning&quot;</strong> for most cheatsheets (command references, shortcuts)</li>
            <li>Use <strong>&quot;intent-to-mechanism&quot;</strong> when users will search by goal (&quot;how do I...&quot;)</li>
            <li>When unsure, default to &quot;mechanism-to-meaning&quot;</li>
          </ul>
        </SubSection>

        <SubSection title="Structuring sections">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Group by functionality, not alphabetically</li>
            <li>Put the most common operations first</li>
            <li>Use section descriptions to provide context when needed</li>
            <li>Keep sections focused—split large sections into smaller ones</li>
          </ul>
        </SubSection>

        <SubSection title="Column label conventions">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Keyboard shortcuts: &quot;Shortcut&quot; / &quot;Action&quot;</li>
            <li>CLI commands: &quot;Command&quot; or &quot;Example&quot; / &quot;Description&quot;</li>
            <li>Configuration: &quot;Option&quot; / &quot;Description&quot; or &quot;Default&quot;</li>
            <li>Glossaries: &quot;Term&quot; / &quot;Definition&quot;</li>
          </ul>
        </SubSection>
      </Section>

      <div className="mt-12 pt-8 border-t border-black/10">
        <p className="text-sm text-zinc-500">
          Schema URL:{" "}
          <code className="font-mono bg-black/5 px-1 rounded">
            https://chson.dev/schema/v2/chson.schema.json
          </code>
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          For the full schema, see{" "}
          <a 
            href="https://github.com/carlesandres/chson/blob/main/packages/chson-schema/schema/v2/chson.schema.json"
            className="text-blue-700 hover:text-blue-800"
          >
            the schema on GitHub
          </a>.
        </p>
      </div>
    </article>
  );
}

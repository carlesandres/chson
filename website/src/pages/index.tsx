import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <p className={styles.heroDescription}>
          A simple JSON format for writing software cheatsheets.<br />
          Write once, render anywhere.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/registry">
            Browse Cheatsheets
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Simple JSON Format',
    icon: '{ }',
    description: (
      <>
        Define cheatsheets in a clean, structured JSON format that's easy to
        read, write, and version control. No complex markup or proprietary formats.
      </>
    ),
  },
  {
    title: 'Tool-Friendly',
    icon: '⚙',
    description: (
      <>
        Validate with JSON Schema. Render to Markdown, HTML, or build your own
        converters for PDFs, flashcards, or custom integrations.
      </>
    ),
  },
  {
    title: 'Extensible',
    icon: '+',
    description: (
      <>
        Add custom metadata fields for your use case while staying compatible
        with the standard schema. The format grows with your needs.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExampleSection(): ReactNode {
  return (
    <section className={styles.exampleSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>How It Works</Heading>
        <div className={styles.exampleGrid}>
          <div className={styles.exampleCode}>
            <div className={styles.codeHeader}>cheatsheet.csif.json</div>
            <pre className={styles.codeBlock}>
{`{
  "$schema": "https://csif.sh/schema/v1/csif.schema.json",
  "title": "Git Essentials",
  "publicationDate": "2026-01-16",
  "description": "Essential git commands.",
  "sections": [
    {
      "title": "Basics",
      "items": [
        {
          "title": "Check status",
          "example": "git status",
          "description": "Show working tree status."
        }
      ]
    }
  ]
}`}
            </pre>
          </div>
          <div className={styles.exampleOutput}>
            <div className={styles.codeHeader}>Rendered Output</div>
            <div className={styles.renderedExample}>
              <h4>Git Essentials</h4>
              <p className={styles.renderedMeta}>Essential git commands.</p>
              <h5>Basics</h5>
              <table className={styles.renderedTable}>
                <thead>
                  <tr><th>Example</th><th>Description</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>git status</code></td>
                    <td>Show working tree status.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="CheatSheet Interchange Format"
      description="A simple JSON format for writing software cheatsheets. Write once, render anywhere.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <ExampleSection />
      </main>
    </Layout>
  );
}

#!/usr/bin/env node

/**
 * Field Length Analysis Tool
 * 
 * Analyzes all ChSON files to determine current max field lengths
 * and validates compliance with proposed maxLength constraints.
 * 
 * Usage:
 *   node scripts/analyze-field-lengths.js [--all-text-fields]
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// Proposed maxLength constraints
const PROPOSED_LIMITS = {
  title: 80,
  description: 150,
  "entry.anchor": 100,
  "entry.content": 150,
  "section.title": 100,
  anchorLabel: 50,
  contentLabel: 50,
};

function collectChsonFiles(dir) {
  const results = [];
  
  function walk(currentPath) {
    const stat = fs.statSync(currentPath);
    
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(currentPath)) {
        walk(path.join(currentPath, entry));
      }
      return;
    }
    
    if (stat.isFile() && currentPath.endsWith(".chson.json")) {
      results.push(currentPath);
    }
  }
  
  walk(dir);
  return results;
}

function analyzeFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const chson = JSON.parse(raw);
  
  const measurements = {
    title: chson.title ? chson.title.length : 0,
    description: chson.description ? chson.description.length : 0,
    anchorLabel: chson.anchorLabel ? chson.anchorLabel.length : 0,
    contentLabel: chson.contentLabel ? chson.contentLabel.length : 0,
    "section.title": [],
    "entry.anchor": [],
    "entry.content": [],
    "entry.details": [],
  };
  
  if (Array.isArray(chson.sections)) {
    for (const section of chson.sections) {
      if (section.title) {
        measurements["section.title"].push(section.title.length);
      }
      
      if (Array.isArray(section.entries)) {
        for (const entry of section.entries) {
          if (entry.anchor) {
            measurements["entry.anchor"].push(entry.anchor.length);
          }
          if (entry.content) {
            measurements["entry.content"].push(entry.content.length);
          }
          if (entry.details) {
            measurements["entry.details"].push(entry.details.length);
          }
        }
      }
    }
  }
  
  return measurements;
}

function main() {
  const args = process.argv.slice(2);
  const allTextFields = args.includes("--all-text-fields");
  
  const registryDir = path.join(process.cwd(), "packages/chson-registry/cheatsheets");
  
  if (!fs.existsSync(registryDir)) {
    console.error(`Registry directory not found: ${registryDir}`);
    return 1;
  }
  
  const files = collectChsonFiles(registryDir);
  
  if (files.length === 0) {
    console.error("No .chson.json files found in registry");
    return 1;
  }
  
  // Aggregate measurements across all files
  const aggregate = {
    title: { max: 0, file: "", values: [] },
    description: { max: 0, file: "", values: [] },
    anchorLabel: { max: 0, file: "", values: [] },
    contentLabel: { max: 0, file: "", values: [] },
    "section.title": { max: 0, file: "", values: [] },
    "entry.anchor": { max: 0, file: "", values: [] },
    "entry.content": { max: 0, file: "", values: [] },
    "entry.details": { max: 0, file: "", values: [] },
  };
  
  for (const filePath of files) {
    try {
      const measurements = analyzeFile(filePath);
      const relativePath = path.relative(registryDir, filePath);
      
      // Process scalar fields
      for (const field of ["title", "description", "anchorLabel", "contentLabel"]) {
        const value = measurements[field];
        aggregate[field].values.push(value);
        if (value > aggregate[field].max) {
          aggregate[field].max = value;
          aggregate[field].file = relativePath;
        }
      }
      
      // Process array fields
      for (const field of ["section.title", "entry.anchor", "entry.content", "entry.details"]) {
        for (const value of measurements[field]) {
          aggregate[field].values.push(value);
          if (value > aggregate[field].max) {
            aggregate[field].max = value;
            aggregate[field].file = relativePath;
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing ${filePath}: ${error.message}`);
    }
  }
  
  // Generate report
  console.log("=".repeat(70));
  console.log("Field Length Analysis - ChSON Registry");
  console.log("=".repeat(70));
  console.log();
  console.log(`Analyzed ${files.length} ChSON files`);
  console.log();
  
  console.log("PROPOSED LIMITS:");
  for (const [field, limit] of Object.entries(PROPOSED_LIMITS)) {
    console.log(`  ${field}: ${limit} chars`);
  }
  console.log();
  
  console.log("CURRENT USAGE:");
  console.log();
  
  const fieldsToCheck = allTextFields
    ? Object.keys(aggregate)
    : Object.keys(PROPOSED_LIMITS);
  
  let totalViolations = 0;
  
  for (const field of fieldsToCheck) {
    const data = aggregate[field];
    const limit = PROPOSED_LIMITS[field];
    
    // Calculate statistics
    const nonZero = data.values.filter((v) => v > 0);
    const count = nonZero.length;
    const avg = count > 0 ? Math.round(nonZero.reduce((a, b) => a + b, 0) / count) : 0;
    
    console.log(`${field}:`);
    console.log(`  Max observed: ${data.max} chars`);
    if (data.file) {
      console.log(`  File: ${data.file}`);
    }
    console.log(`  Average: ${avg} chars (${count} instances)`);
    
    if (limit) {
      const violations = data.values.filter((v) => v > limit);
      const violationCount = violations.length;
      
      if (violationCount > 0) {
        console.log(`  ✗ VIOLATIONS: ${violationCount} instances exceed ${limit} chars`);
        totalViolations += violationCount;
      } else {
        console.log(`  ✓ All instances comply with ${limit} char limit`);
      }
    }
    
    console.log();
  }
  
  console.log("=".repeat(70));
  console.log("SUMMARY");
  console.log("=".repeat(70));
  
  if (totalViolations > 0) {
    console.log(`✗ ${totalViolations} total violations found`);
    console.log();
    console.log("ACTION REQUIRED: Either adjust proposed limits or refactor content");
    return 1;
  } else {
    console.log(`✓ All ${files.length} files comply with proposed limits`);
    console.log();
    console.log("READY: Safe to add maxLength constraints to schema");
    return 0;
  }
}

process.exitCode = main();

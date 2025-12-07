#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const EXTENSION_DIR = path.join(__dirname, "letterboxd-movie-picker");
const OUTPUT_DIR = path.join(__dirname, "dist");
const ZIP_NAME = "letterboxd-movie-picker.zip";

// Files and directories to include in the extension
const INCLUDE_PATTERNS = [
  "manifest.json",
  "styles.css",
  "js/**/*",
  "images/**/*",
];

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  "node_modules",
  "tests",
  "test-results",
  "playwright-report",
  "playwright",
  "package.json",
  "package-lock.json",
  "playwright.config.js",
  ".gitignore",
  ".git",
  ".DS_Store",
  "*.log",
  "*.zip",
  "*.crx",
  "*.pem",
  ".vscode",
  ".idea",
  "dist",
  "build",
];

function shouldExclude(filePath) {
  const relativePath = path.relative(EXTENSION_DIR, filePath);
  const fileName = path.basename(filePath);

  // Check exclude patterns
  for (const pattern of EXCLUDE_PATTERNS) {
    if (relativePath.includes(pattern) || fileName.includes(pattern)) {
      return true;
    }
    // Check wildcard patterns
    if (pattern.includes("*")) {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      if (regex.test(relativePath) || regex.test(fileName)) {
        return true;
      }
    }
  }

  return false;
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!shouldExclude(filePath)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      if (!shouldExclude(filePath)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function createZip() {
  console.log("Building Chrome extension package...\n");

  // Check if extension directory exists
  if (!fs.existsSync(EXTENSION_DIR)) {
    console.error(`Extension directory not found: ${EXTENSION_DIR}`);
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all files to include
  console.log("📋 Collecting files...");
  const files = getAllFiles(EXTENSION_DIR);

  console.log(`Found ${files.length} files to include\n`);

  // Create a temporary directory for the package
  const tempDir = path.join(OUTPUT_DIR, "temp-extension");
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Copy files to temp directory
  console.log("📁 Copying files...");
  files.forEach((file) => {
    const relativePath = path.relative(EXTENSION_DIR, file);
    const destPath = path.join(tempDir, relativePath);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(file, destPath);
  });

  // Create zip file
  const zipPath = path.join(OUTPUT_DIR, ZIP_NAME);
  console.log(`\nCreating zip file: ${zipPath}...`);

  try {
    // Use zip command (available on macOS/Linux)
    // For Windows, you might need to install a zip utility or use a Node.js zip library
    process.chdir(tempDir);
    execSync(`zip -r "${zipPath}" .`, { stdio: "inherit" });
    process.chdir(__dirname);

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });

    const zipSize = (fs.statSync(zipPath).size / 1024).toFixed(2);
    console.log(`\nExtension package created successfully!`);
    console.log(`File: ${zipPath}`);
    console.log(`Size: ${zipSize} KB\n`);
    console.log("Ready to upload to Chrome Web Store!\n");
  } catch (error) {
    console.error("\nError creating zip file:", error.message);
    console.log('\n💡 Tip: Make sure you have "zip" command installed.');
    console.log("   On macOS/Linux: Usually pre-installed");
    console.log("   On Windows: Install 7-Zip or use WSL\n");

    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    process.exit(1);
  }
}

// Run the build
createZip();

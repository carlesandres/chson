# npm Essentials

Version: 10.x
Published: 2026-01-16

Essential npm commands for Node.js package management.

## Project Setup

| Example | Description |
| --- | --- |
| <pre>npm init -y</pre> | Create package.json with defaults. |
| <pre>npm install</pre> | Install all dependencies from package.json. |
| <pre>npm ci</pre> | Install exact versions from package-lock.json. |

## Dependencies

| Example | Description |
| --- | --- |
| <pre>npm install lodash</pre> | Install and save as dependency. |
| <pre>npm install -D typescript</pre> | Install as devDependency. |
| <pre>npm install -g npm-check-updates</pre> | Install package globally. |
| <pre>npm uninstall lodash</pre> | Remove package and update package.json. |
| <pre>npm ls --depth=0</pre> | Show top-level installed packages. |

## Scripts

| Example | Description |
| --- | --- |
| <pre>npm run build</pre> | Execute a script defined in package.json. |
| <pre>npm test</pre> | Run the test script (shorthand). |
| <pre>npm start</pre> | Run the start script (shorthand). |
| <pre>npm run</pre> | Show all available scripts. |

## Updates

| Example | Description |
| --- | --- |
| <pre>npm outdated</pre> | Show packages with newer versions available. |
| <pre>npm update</pre> | Update packages within semver range. |
| <pre>npm install -g npm@latest</pre> | Update npm itself to latest version. |

## Info & Debug

| Example | Description |
| --- | --- |
| <pre>npm info react</pre> | Show registry information for a package. |
| <pre>npm audit</pre> | Scan dependencies for security issues. |
| <pre>npm audit fix</pre> | Automatically fix security issues when possible. |
| <pre>npm explain lodash</pre> | Show why a package is installed. |

## Publishing

| Example | Description |
| --- | --- |
| <pre>npm login</pre> | Authenticate with npm registry. |
| <pre>npm publish</pre> | Publish package to registry. |
| <pre>npm version patch</pre> | Increment version (patch/minor/major). |

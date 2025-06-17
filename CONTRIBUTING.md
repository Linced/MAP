# Contributing to MAP

First off, thank you for considering contributing to MAP! It's people like you that make MAP such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/Linced/MAP/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/Linced/MAP/issues/new/choose).
- Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior.

### Suggesting Enhancements

- Open a new issue with the enhancement template.
- Provide a clear title and description.
- Explain why this enhancement would be useful.
- Include any relevant screenshots or examples.

### Pull Requests

1. Fork the repository and create your branch from `develop`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+

### Installation

1. Fork the repository
2. Clone your fork
   ```bash
   git clone https://github.com/your-username/MAP.git
   cd MAP
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
5. Start the development server
   ```bash
   npm run dev
   ```

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

# Contributing to AswitchI

First off, thank you for considering contributing to AswitchI! It's people like you that make AswitchI such a great tool for the AI developer community.

The following is a set of guidelines for contributing to AswitchI, which is hosted in the [Maijied/AswitchI](https://github.com/Maijied/AswitchI) repository on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
    * [Reporting Bugs](#reporting-bugs)
    * [Suggesting Enhancements](#suggesting-enhancements)
    * [Your First Code Contribution](#your-first-code-contribution)
3. [Development Setup](#development-setup)
4. [Pull Request Process](#pull-request-process)

---

## Code of Conduct
This project and everyone participating in it is governed by the [AswitchI Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **lorapokdev@gmail.com**.

## How Can I Contribute?

### Reporting Bugs
Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:
* Use a clear and descriptive title for the issue to identify the problem.
* Describe the exact steps which reproduce the problem in as many details as possible.
* Provide specific examples to demonstrate the steps. Include links to files or GitHub projects, or copy/pasteable snippets.
* Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
* Explain which behavior you expected to see instead and why.

### Suggesting Enhancements
Enhancement suggestions are tracked as GitHub issues. When you are creating an enhancement suggestion, please include:
* A clear and descriptive title for the issue.
* A step-by-step description of the suggested enhancement in as many details as possible.
* Specific examples to demonstrate the steps.
* A description of the current behavior and the behavior you expected to see instead.
* An explanation of why this enhancement would be useful to most AswitchI users.

### Your First Code Contribution
Unsure where to begin contributing to AswitchI? You can start by looking through `good first issue` and `help wanted` issues. 

## Development Setup

To set up your local development environment:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Maijied/AswitchI.git
   cd AswitchI
   ```
2. **Install dependencies:**
   AswitchI relies on `python3`, `gir1.2-gtk-3.0`, and `gir1.2-webkit2-4.1`. Make sure these are installed on your Ubuntu/Debian system.
   ```bash
   sudo apt-get install python3 python3-gi gir1.2-gtk-3.0 gir1.2-webkit2-4.1 libwebkit2gtk-4.1-0
   ```
3. **Run locally:**
   ```bash
   python3 bin/aswitchi
   ```
4. **Run the test suite:**
   Ensure your changes don't break existing functionality by running the PyUnit test suite:
   ```bash
   python3 tests/run_all_tests.py
   ```

## Pull Request Process
1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. Verify that the 26-test PyUnit suite passes entirely before submitting.
4. If your PR modifies the React Admin Panel, ensure you run `npm run build` in `website/admin` and verify there are no compilation errors.
5. You may merge the Pull Request in once you have the sign-off of the core maintainers.

Thank you for contributing to Lorapok Labs!

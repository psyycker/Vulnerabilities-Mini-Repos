# Vulnerability Multi-Docker Repository

## Project Overview
This repository is a library of intentionally vulnerable micro web applications, each designed to demonstrate specific security vulnerabilities. Each application is containerized and can be deployed independently.

## Repository Structure
- Each folder contains a self-contained vulnerable application
- Each application includes:
  - Source code for the vulnerable web app
  - Dockerfile for containerization
  - docker-compose.yml for easy deployment
  - README with vulnerability description and exploitation steps

## Development Guidelines

### Creating New Vulnerable Applications

**IMPORTANT: Make Applications Realistic**
Each vulnerable application should simulate a REAL application with a realistic use case. The vulnerability should exist naturally within the context of the application's functionality, NOT as an obvious "vulnerable endpoint".

**Good Example:** A photo gallery app where the image serving endpoint has a path traversal vulnerability
**Bad Example:** A generic "file server" with an obvious `/files` endpoint

#### Requirements for Each Mini-Repo:

1. **Realistic Application Context**
   - Build a simple but realistic web application (e.g., photo gallery, blog, user profile, shopping cart)
   - The vulnerability should exist naturally in a feature (e.g., image serving, search, file download)
   - Users should be able to interact with the app normally before discovering the vulnerability
   - Make it feel like a real application that could exist in production

2. **Folder Structure**
   - Create a new folder named after the vulnerability (e.g., `sql-injection`, `xss-reflected`, `command-injection`)
   - Each folder must contain:
     - Source code for the vulnerable web app
     - `Dockerfile` for containerization
     - `docker-compose.yml` for easy deployment
     - `README.md` with comprehensive documentation
     - `package.json` or equivalent dependency file

3. **README.md Content** (Each vulnerability folder must have this)
   - **Warning Section**: Clear warning that the app is intentionally vulnerable
   - **Vulnerability Description**: What the vulnerability is (include OWASP/CWE classifications)
   - **Application Overview**: Describe what the app does and the realistic scenario
   - **Directory Structure**: Show the file/folder layout
   - **How to Run**: Docker commands to build and run
   - **Exploitation Steps**:
     - Start with normal usage (intended behavior)
     - Progress to discovering the vulnerability
     - Show multiple exploitation techniques
     - Include both curl commands and browser-based examples
   - **Vulnerable Code**: Show the specific code with the vulnerability highlighted
   - **How to Fix**: Provide secure implementation example
   - **Mitigation Strategies**: List best practices to prevent this vulnerability
   - **Real-World Impact**: Explain the potential damage and real CVE examples if applicable
   - **Learning Resources**: Links to OWASP, CWE, PortSwigger, etc.
   - **Clean Up**: Docker commands to stop and remove containers

4. **Application Design**
   - Keep applications minimal but realistic
   - Focus on demonstrating ONE specific vulnerability clearly
   - Use simple, popular frameworks (Express, Flask, PHP, etc.)
   - Include realistic sensitive data (fake credentials, API keys, etc.)
   - Add debug logging with the `DEBUG` prefix for troubleshooting

5. **Update Root README.md**
   - After creating a new vulnerability, add it to the table in `/README.md`
   - Include: vulnerability name, folder name, and brief description

### Security Considerations
- **IMPORTANT**: These applications are INTENTIONALLY VULNERABLE
- Never deploy these to production environments
- Always include clear warnings in documentation
- Use only for authorized security testing, education, and CTF challenges

### Code Standards
- Keep code simple and readable
- Comment the vulnerable code sections clearly
- Include both vulnerable and secure code examples where appropriate
- Use Docker best practices (except where vulnerability requires otherwise)

## Usage
Each application can be run independently:
```bash
cd <vulnerability-folder>
docker-compose up
```

## Educational Purpose
This repository is designed for:
- Security education and training
- Penetration testing practice
- Understanding common web vulnerabilities
- CTF challenge preparation
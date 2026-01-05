# Vulnerability Multi-Docker Repository

A collection of intentionally vulnerable Docker containers for security education and training.

## ⚠️ IMPORTANT WARNING

**These applications are INTENTIONALLY VULNERABLE.**

- **DO NOT** deploy these in production environments
- **DO NOT** expose these containers to the internet
- Use ONLY for authorized security testing, education, and CTF challenges
- Always run in isolated environments

## What is This?

This repository contains multiple Docker containers, each hosting a small web application that demonstrates a specific security vulnerability. Each container is self-contained and can be run independently to practice exploiting and understanding common web vulnerabilities.

## Purpose

This project is designed for:
- **Security Education**: Learn how vulnerabilities work in realistic applications
- **Penetration Testing Practice**: Sharpen your offensive security skills
- **CTF Training**: Prepare for Capture The Flag competitions
- **Developer Awareness**: Understand common security pitfalls to avoid

## About the Code

The code in this repository was primarily generated with AI assistance and serves no purpose other than education. These are simplified examples designed to clearly demonstrate specific vulnerabilities without the complexity of real-world applications.

## Available Vulnerabilities

Each folder contains a complete vulnerable application with:
- Source code demonstrating the vulnerability
- Dockerfile for easy containerization
- docker-compose.yml for simple deployment
- README with exploitation steps and mitigation strategies

### Current Vulnerabilities

| Vulnerability | Folder | Description |
|---------------|--------|-------------|
| **Path Traversal** | `path-traversal/` | Photo gallery app with file path manipulation vulnerability |

*More vulnerabilities coming soon...*

## How to Use

Each vulnerability lives in its own folder. To run a specific vulnerable application:

```bash
# Navigate to the vulnerability folder
cd path-traversal

# Build and run the container
docker-compose up --build

# The application will be available at http://localhost:3000
# (port may vary - check the folder's README)
```

## Learning More

For detailed articles and explanations about these vulnerabilities, check out my Medium blog:

**[https://medium.com/@remy-villulles](https://medium.com/@remy-villulles)**

I write in-depth articles covering:
- How each vulnerability works
- Real-world examples and impact
- Exploitation techniques
- Mitigation strategies
- Secure coding practices

## Contributing

Feel free to open issues or submit pull requests if you:
- Find bugs in the vulnerable applications
- Want to suggest new vulnerabilities to add
- Have improvements to the documentation

## License

This project is provided as-is for educational purposes. Use responsibly and ethically.

## Disclaimer

The author is not responsible for any misuse of the information or code provided in this repository. All content is intended solely for educational and authorized security testing purposes. Always ensure you have proper authorization before testing security vulnerabilities.

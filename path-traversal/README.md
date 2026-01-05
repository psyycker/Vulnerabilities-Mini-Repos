# Path Traversal Vulnerability - Photo Gallery

## ⚠️ WARNING
This application is **INTENTIONALLY VULNERABLE**. Do not deploy in production environments. Use only for authorized security testing, education, and CTF challenges.

## Vulnerability Description

**Path Traversal** (also known as Directory Traversal) is a web security vulnerability that allows attackers to read arbitrary files on the server by manipulating file path parameters. This occurs when an application uses user input to construct file paths without proper validation.

### OWASP Classification
- **CWE-22**: Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')
- **OWASP Top 10**: A01:2021 – Broken Access Control

## Application Overview

This is a simple photo gallery web application built with Node.js/Express. Users can browse through a collection of images. The application serves images through an `/image` endpoint that takes a filename parameter.

**Real-world scenario:** Many web applications serve user-uploaded content, profile pictures, or media files through similar endpoints. A path traversal vulnerability in such endpoints can expose sensitive configuration files, credentials, and other critical data.

**Directory Structure:**
```
/app
├── images/          (Public image gallery)
│   ├── landscape1.svg
│   ├── landscape2.svg
│   ├── portrait1.svg
│   └── abstract1.svg
└── config/          (Should NOT be accessible)
    ├── database.conf (Database credentials)
    └── .env          (API keys, secrets)
```

## How to Run

```bash
# Build and start the container
docker-compose up --build

# The application will be available at:
# http://localhost:3000
```

## Exploitation Steps

### 1. Normal Usage (Browse the Gallery)
Visit http://localhost:3000 in your browser to see the photo gallery. You'll see 4 colorful placeholder images. Each image is loaded via the `/image` endpoint:

```bash
# View a legitimate image
curl "http://localhost:3000/image?file=landscape1.svg"

# Or in your browser:
http://localhost:3000/image?file=landscape1.svg
```

### 2. Discover the Vulnerability
Notice that images are served through a query parameter `file`. This is a common attack surface for path traversal vulnerabilities.

### 3. Exploit Path Traversal
Use `../` sequences to traverse up directories and access sensitive configuration files:

```bash
# Access database configuration (one directory up)
curl "http://localhost:3000/image?file=../config/database.conf"

# Access environment variables with secrets
curl "http://localhost:3000/image?file=../config/.env"

# Try to access system files (on Linux containers)
curl "http://localhost:3000/image?file=../../../etc/passwd"
curl "http://localhost:3000/image?file=../../../etc/hostname"
```

**In browser:** Navigate to:
- `http://localhost:3000/image?file=../config/database.conf`
- `http://localhost:3000/image?file=../config/.env`

You'll see sensitive information including:
- Database passwords
- AWS access keys
- Stripe API keys
- JWT secrets

### 4. Advanced Exploitation Techniques

**URL Encoding:**
```bash
# URL-encoded path traversal (bypasses some basic filters)
curl "http://localhost:3000/image?file=..%2Fconfig%2Fdatabase.conf"

# Double URL encoding
curl "http://localhost:3000/image?file=..%252Fconfig%252F.env"
```

**Null byte injection (Node.js versions < 8.5):**
```bash
curl "http://localhost:3000/image?file=../config/.env%00.svg"
```

## Vulnerable Code

The vulnerability exists in the `/image` endpoint (app.js:103-142):

```javascript
app.get('/image', (req, res) => {
    const fileName = req.query.file;

    // VULNERABILITY: Direct concatenation without validation
    // This allows attackers to use ../ to traverse directories
    const imagePath = path.join(imagesDir, fileName);

    // No check if the resolved path is within imagesDir
    if (fs.existsSync(imagePath)) {
        const content = fs.readFileSync(imagePath);
        res.send(content);
    }
});
```

**Problem:** The application directly concatenates user input (`fileName`) with the images directory path without validating that the resulting path stays within the intended `images/` directory.

## How to Fix (Secure Implementation)

Here's how to properly secure this endpoint:

```javascript
app.get('/image', (req, res) => {
    const fileName = req.query.file;

    // STEP 1: Resolve the full path
    const imagePath = path.resolve(imagesDir, fileName);
    const normalizedImagesDir = path.resolve(imagesDir);

    // STEP 2: Check if the resolved path is within the allowed directory
    if (!imagePath.startsWith(normalizedImagesDir + path.sep)) {
        return res.status(403).send('Access denied: Invalid file path');
    }

    // STEP 3: Additional validation - check file extension
    const allowedExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif'];
    const ext = path.extname(imagePath).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        return res.status(403).send('Invalid file type');
    }

    // STEP 4: Proceed with file serving
    if (fs.existsSync(imagePath)) {
        const content = fs.readFileSync(imagePath);
        res.type(ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`);
        res.send(content);
    } else {
        res.status(404).send('Image not found');
    }
});
```

## Mitigation Strategies

1. **Path Validation**: Always validate that resolved paths stay within intended directories using `path.resolve()` and string comparison
2. **Whitelist Approach**: Use a whitelist of allowed file names or file extensions
3. **Use IDs Instead of Filenames**: Map numeric IDs to filenames server-side instead of accepting file paths directly
4. **Canonicalize Paths**: Use `path.resolve()` to get absolute paths and verify they're within allowed directories
5. **Input Sanitization**: Remove or reject requests containing `../`, `..\\`, or encoded variations
6. **Principle of Least Privilege**: Run applications with minimal file system permissions
7. **Security Libraries**: Use framework-specific security middleware

## Real-World Impact

Path Traversal vulnerabilities have been found in major applications and can lead to:

**Information Disclosure:**
- Database credentials and connection strings
- API keys, tokens, and secrets
- Application source code
- User data and PII

**System Compromise:**
- Reading `/etc/passwd` to enumerate system users
- Accessing SSH keys (`~/.ssh/id_rsa`)
- Reading system configuration files
- In combination with file upload vulnerabilities: Remote Code Execution

**Real Examples:**
- **CVE-2019-11043** - PHP-FPM path traversal leading to RCE
- **CVE-2021-41773** - Apache HTTP Server 2.4.49 path traversal
- **CVE-2018-1000600** - Jenkins arbitrary file read via path traversal

## Learning Resources

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)
- [PortSwigger: Directory Traversal](https://portswigger.net/web-security/file-path-traversal)
- [HackerOne Path Traversal Reports](https://hackerone.com/reports?text=path%20traversal)

## Clean Up

```bash
# Stop the container
docker-compose down

# Remove the image
docker rmi path-traversal-vuln
```

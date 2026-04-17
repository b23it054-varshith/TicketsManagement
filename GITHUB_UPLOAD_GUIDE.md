# Guide: Uploading your MERN Project to GitHub

This guide helps you organize your files and upload your mini-project to GitHub properly.

## 1. File Arrangement (Preparation)
The project is already organized into a standard MERN structure:
- **/client**: React frontend code.
- **/server**: Node.js & Express backend code.
- **.gitignore**: Prevents large files (`node_modules`) and sensitive data (`.env`) from being uploaded.
- **README.md**: Your project documentation.

> [!IMPORTANT]
> **What NOT to upload**:
> - Never upload `node_modules/` folders (they are huge).
> - Never upload `.env` files (they contain your database passwords).
> - These are already handled by the `.gitignore` file I created.

---

## 2. Step-by-Step GitHub Upload

### Step A: Create a Repository on GitHub
1. Go to your [GitHub profile](https://github.com/).
2. Click the **+** icon (top-right) -> **New repository**.
3. Name it (e.g., `TicketManagementSystem-MERN`).
4. Set it to **Public**.
5. **Do NOT** check "Add a README" or ".gitignore" (we already have them).
6. Click **Create repository**.

### Step B: Link and Push your code
Open your terminal in the root folder (`Miniproject_MERN`) and run these exact commands:

1. **Initialize Git (if not already done)**:
   ```bash
   git init
   ```

2. **Stage your changes**:
   ```bash
   git add .
   ```

3. **Commit your final changes**:
   ```bash
   git commit -m "Final simplified version of Ticket Management Project"
   ```

4. **Rename branch to main**:
   ```bash
   git branch -M main
   ```

5. **Link to your GitHub repo**:
   *(Replace `<YOUR_GITHUB_URL>` with the URL from your new GitHub repo)*
   ```bash
   git remote add origin <YOUR_GITHUB_URL>
   ```

6. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

---

## 3. Final Verification on GitHub
Once uploaded, your GitHub repository should look like this:
```text
Miniproject_MERN/
├── client/
├── server/
├── .gitignore
└── README.md
```
*(Note: node_modules and .env will be missing, which is correct! Buyers/Teachers will run `npm install` to get them back.)*

## 4. Tips for your Viva/Presentation
- **README**: Ensure your README looks professional (it already includes Setup instructions).
- **Commit Messages**: Notice we used a clear message like "Final simplified version".
- **Clean Code**: By removing Socket.io and extra complexities, you can now explain every line of code easily.

---
**Your project is now ready for submission!**

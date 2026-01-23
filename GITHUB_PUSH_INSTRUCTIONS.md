# GitHub Push Instructions

Your website has been successfully organized and committed to Git! Follow these steps to push to GitHub:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Enter a repository name (e.g., `basil-sage-homes-website`)
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

## Step 2: Add GitHub Remote and Push

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Add the GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin master
```

### Alternative: Using SSH (if you have SSH keys set up)
```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git push -u origin master
```

## Step 3: Verify

1. Refresh your GitHub repository page
2. You should see all your files organized in the new structure

## Quick Copy-Paste Commands

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin master
```

## Future Updates

After the initial push, you can update your repository with:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

### Authentication Issues
If you encounter authentication issues:
- Use a Personal Access Token instead of password
- Generate one at: Settings → Developer settings → Personal access tokens → Tokens (classic)
- Use the token as your password when prompted

### Branch Name
If GitHub suggests using `main` instead of `master`:
```bash
git branch -M main
git push -u origin main
```

---

## ✅ What's Been Done

- ✅ Created optimized directory structure
- ✅ Organized all files into logical folders:
  - `assets/css/` - All stylesheets
  - `assets/js/` - All JavaScript files
  - `assets/images/` - All images and logos
  - `assets/videos/` - Video files
  - `pages/` - All HTML pages
  - `pages/properties/` - Individual property listings
  - `server/` - Backend server code
- ✅ Created `.gitignore` to exclude sensitive files
- ✅ Created comprehensive `README.md`
- ✅ Committed all changes to Git
- ⏳ **Ready to push to GitHub** (follow steps above)

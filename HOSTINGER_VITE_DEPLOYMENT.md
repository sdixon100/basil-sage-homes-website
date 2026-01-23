# Hostinger Deployment Guide - Vite Build

## 🚀 Quick Deployment Steps

Your website has been built with Vite and is ready for Hostinger deployment.

### Production Files Location
All deployment files are in: `c:\Users\sdkoe\Desktop\Website for Demo\dist\`

---

## 📋 Step-by-Step Deployment

### Method 1: Using Hostinger File Manager (Easiest)

1. **Login to Hostinger**
   - Go to: https://hpanel.hostinger.com
   - Login with your credentials

2. **Access File Manager**
   - Click on your hosting plan
   - Click "File Manager" in the Files section
   - Navigate to `public_html` folder

3. **Clear Existing Files**
   - Select ALL files in `public_html` (except `cgi-bin` if present)
   - Click "Delete"
   - Confirm deletion

4. **Upload Production Files**
   - Click "Upload Files" button
   - Navigate to: `c:\Users\sdkoe\Desktop\Website for Demo\dist\`
   - Select ALL files and folders:
     - All HTML files (28 files)
     - `assets/` folder (with CSS, JS, images, video)
     - `.htaccess` file
     - `robots.txt`
     - `sitemap.xml`
   - Click "Upload"
   - Wait for upload to complete

5. **Verify Upload**
   - Ensure `public_html` contains:
     ```
     public_html/
     ├── index.html
     ├── about.html
     ├── contact.html
     ├── [all other HTML files]
     ├── assets/
     │   ├── styles-DLcjrhvZ.css
     │   ├── listings-Ziw8CeZZ.css
     │   ├── testimonials-Btkh4PND.css
     │   ├── basil-sage-logo-CHrlvGtm.png
     │   ├── herovideo-CjMQ1WD_.mp4
     │   └── [other optimized assets]
     ├── .htaccess
     ├── robots.txt
     └── sitemap.xml
     ```

---

### Method 2: Using FTP/SFTP (FileZilla)

1. **Get FTP Credentials**
   - In Hostinger hPanel: Files → FTP Accounts
   - Note: hostname, username, password
   - Port: 21 (FTP) or 22 (SFTP)

2. **Connect with FileZilla**
   - Download FileZilla: https://filezilla-project.org
   - File → Site Manager → New Site
   - Enter your FTP credentials
   - Click "Connect"

3. **Upload Files**
   - Left pane: Navigate to `c:\Users\sdkoe\Desktop\Website for Demo\dist\`
   - Right pane: Navigate to `public_html`
   - Delete all existing files in `public_html` (except `cgi-bin`)
   - Select ALL files/folders in left pane
   - Right-click → Upload
   - Wait for transfer to complete

---

## ✅ Post-Deployment Checklist

### 1. Test Your Website
- [ ] Visit your domain (e.g., https://yourdomain.com)
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Images and video display properly
- [ ] CSS styling is applied
- [ ] JavaScript features work (carousel, forms, etc.)
- [ ] Test on mobile device

### 2. Verify File Permissions
In Hostinger File Manager, check:
- `.htaccess` → Permissions: 644
- `index.html` → Permissions: 644
- All HTML files → Permissions: 644
- `assets/` folder → Permissions: 755

### 3. Enable SSL/HTTPS
- In Hostinger hPanel: Security → SSL
- Enable "Force HTTPS"
- Wait 10-15 minutes for SSL to activate
- Your `.htaccess` already has HTTPS redirect configured

### 4. Clear Browser Cache
- Clear your browser cache (Ctrl+Shift+Delete)
- Test in incognito/private mode
- Try from different devices/networks

---

## 🔧 Troubleshooting

### Issue: "Cannot GET /" Error

**Solution:**
1. Verify `index.html` is in `public_html` root (not in a subfolder)
2. Check file permissions: `index.html` should be 644
3. Ensure `.htaccess` is uploaded and has correct permissions
4. Clear browser cache and try again

### Issue: CSS/Images Not Loading

**Solution:**
1. Verify `assets/` folder is uploaded completely
2. Check that asset files have correct permissions (644)
3. Open browser console (F12) to see which files are 404
4. Ensure all files from `dist/` folder were uploaded

### Issue: 404 Errors on Page Links

**Solution:**
1. Verify ALL HTML files are in `public_html` root
2. Check `.htaccess` is present and working
3. Test direct URL: `yourdomain.com/about.html`

### Issue: HTTPS Redirect Loop

**Solution:**
1. In `.htaccess`, temporarily comment out HTTPS redirect:
   ```apache
   # RewriteCond %{HTTPS} off
   # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```
2. Wait for Hostinger SSL to fully activate (10-15 min)
3. Uncomment the lines after SSL is active

---

## 📊 What's Included in dist/ Folder

### HTML Files (28 pages)
- Homepage: `index.html`
- Main pages: about, contact, listings, testimonials, etc.
- Feature pages: move-in-ready, pet-friendly, etc.
- Property pages: property-123-oak, property-456-maple, etc.
- Legal pages: terms, privacy, cookies

### Optimized Assets
- **CSS**: Minified and bundled (31 KB → 6.38 KB gzipped)
- **Images**: Optimized PNG/JPG files
- **Video**: Hero video (31 MB)
- **JavaScript**: Bundled and optimized

### Configuration Files
- `.htaccess`: Server configuration
- `robots.txt`: SEO configuration
- `sitemap.xml`: Search engine sitemap

---

## 🔄 Future Updates

When you need to update the website:

1. **Make changes** to source files in main folder
2. **Rebuild**: Run `npm run build`
3. **Copy config files** to dist:
   ```powershell
   Copy-Item -Path ".htaccess" -Destination "dist\" -Force
   Copy-Item -Path "robots.txt" -Destination "dist\" -Force
   Copy-Item -Path "sitemap.xml" -Destination "dist\" -Force
   ```
4. **Upload** new `dist/` contents to Hostinger

---

## 📞 Support

If you encounter issues:
1. Check Hostinger documentation: https://support.hostinger.com
2. Contact Hostinger support via live chat
3. Verify all files from `dist/` folder are uploaded
4. Check browser console (F12) for specific errors

---

## ✨ Build Information

- **Build Tool**: Vite 5.4.21
- **Build Time**: ~980ms
- **Total Files**: 28 HTML pages + optimized assets
- **Total Size**: ~34 MB (mostly video)
- **Optimizations**: Minified CSS/JS, compressed images

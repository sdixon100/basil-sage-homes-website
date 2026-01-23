# Hostinger Deployment Guide - Basil & Sage Homes

## Prerequisites
- Active Hostinger hosting account
- Domain name configured in Hostinger
- FTP/SFTP credentials from Hostinger
- FileZilla or similar FTP client (or use Hostinger File Manager)

## Files Ready for Deployment
Your website is already configured and ready to deploy to Hostinger. All necessary files are present:

### Core Files
- `index.html` - Homepage
- `styles.css` - Main stylesheet
- `scripts.js` - Main JavaScript
- `features-carousel.js` - Slideshow functionality
- `.htaccess` - Server configuration (already optimized)
- `robots.txt` - SEO configuration
- `sitemap.xml` - Search engine sitemap

### Additional Pages
- About, Contact, FAQ, Features, Map, Compare
- Feature detail pages (move-in-ready, professional-management, etc.)
- Property detail pages
- Legal pages (terms, privacy, cookies, etc.)

### Assets
- `basil-sage-logo.png` - Company logo
- `herovideo.mp4` - Hero section video
- `images/` folder - Additional images
- Various property images

## Deployment Steps

### Option 1: Using Hostinger File Manager (Recommended for Beginners)

1. **Login to Hostinger**
   - Go to https://hpanel.hostinger.com
   - Login with your credentials

2. **Access File Manager**
   - Click on your hosting plan
   - Click "File Manager" in the Files section
   - Navigate to `public_html` folder

3. **Clear Default Files**
   - Delete any default files in `public_html` (like default index.html)
   - Keep the `cgi-bin` folder if present

4. **Upload Your Website**
   - Click "Upload Files" button
   - Select ALL files from: `c:\Users\sdkoe\Desktop\Website for Demo\`
   - Upload everything including:
     - All HTML files
     - CSS files
     - JavaScript files
     - Images and videos
     - `.htaccess` file (important!)
     - `robots.txt` and `sitemap.xml`

5. **Verify Upload**
   - Ensure all files are in `public_html` (not in a subfolder)
   - Check that `.htaccess` is present (enable "Show Hidden Files" if needed)

### Option 2: Using FTP/SFTP (Recommended for Advanced Users)

1. **Get FTP Credentials**
   - In Hostinger hPanel, go to Files → FTP Accounts
   - Note your FTP hostname, username, and password
   - Port: 21 (FTP) or 22 (SFTP - recommended)

2. **Configure FileZilla**
   - Download FileZilla from https://filezilla-project.org
   - Open FileZilla
   - Go to File → Site Manager
   - Click "New Site"
   - Enter:
     - Protocol: SFTP (or FTP)
     - Host: Your FTP hostname from Hostinger
     - Port: 22 (SFTP) or 21 (FTP)
     - Logon Type: Normal
     - User: Your FTP username
     - Password: Your FTP password
   - Click "Connect"

3. **Upload Files**
   - In the left pane (Local site): Navigate to `c:\Users\sdkoe\Desktop\Website for Demo\`
   - In the right pane (Remote site): Navigate to `public_html`
   - Select ALL files in the left pane
   - Right-click → Upload
   - Wait for all files to transfer

4. **Verify Upload**
   - Check that all files are in `public_html`
   - Verify `.htaccess` is uploaded

## Post-Deployment Configuration

### 1. Test Your Website
- Visit your domain (e.g., https://yourdomain.com)
- Test all pages and links
- Verify images and videos load correctly
- Test the slideshow on the homepage
- Check mobile responsiveness

### 2. SSL Certificate (HTTPS)
- In Hostinger hPanel, go to Security → SSL
- Enable "Force HTTPS" (your `.htaccess` already handles this)
- Wait 10-15 minutes for SSL to activate

### 3. Update Domain Settings (if needed)
- Ensure your domain points to Hostinger nameservers
- Nameservers are typically:
  - ns1.dns-parking.com
  - ns2.dns-parking.com
- DNS propagation can take 24-48 hours

### 4. Configure Email (Optional)
- In Hostinger hPanel, go to Emails
- Create email accounts (e.g., info@yourdomain.com)
- Update contact forms if needed

## Important Notes

### .htaccess Configuration
Your `.htaccess` file is already configured with:
- ✅ Force HTTPS (SSL)
- ✅ Remove .html extensions from URLs
- ✅ Redirect www to non-www
- ✅ Compression for faster loading
- ✅ Browser caching
- ✅ Security headers

### File Permissions
Hostinger typically sets correct permissions automatically. If you encounter issues:
- Folders: 755
- Files: 644
- `.htaccess`: 644

### Server Requirements
Your website uses:
- HTML5
- CSS3
- JavaScript (ES6+)
- No server-side processing required (static site)
- No database required

## Troubleshooting

### Website Not Loading
1. Clear browser cache (Ctrl+F5)
2. Check that files are in `public_html`, not a subfolder
3. Verify domain DNS settings
4. Wait for SSL certificate activation (10-15 minutes)

### .htaccess Not Working
1. Ensure `.htaccess` is in `public_html` root
2. Enable "Show Hidden Files" in File Manager
3. Check file permissions (should be 644)
4. Contact Hostinger support if mod_rewrite is disabled

### Images/Videos Not Loading
1. Verify files uploaded correctly
2. Check file paths are correct (case-sensitive on Linux servers)
3. Ensure large files (like herovideo.mp4) completed upload
4. Check file permissions

### 404 Errors
1. Verify `.htaccess` is uploaded and working
2. Check that all HTML files are in `public_html`
3. Test with full filename (e.g., /about.html instead of /about)

## Performance Optimization (Already Configured)

Your website includes:
- ✅ Gzip compression via `.htaccess`
- ✅ Browser caching headers
- ✅ Optimized CSS and JavaScript
- ✅ Lazy loading for images
- ✅ Minified code where possible

## SEO Configuration (Already Configured)

Your website includes:
- ✅ `robots.txt` for search engine crawling
- ✅ `sitemap.xml` for search engine indexing
- ✅ Meta tags in all pages
- ✅ Semantic HTML structure
- ✅ Mobile-responsive design

## Next Steps After Deployment

1. **Submit to Search Engines**
   - Google Search Console: https://search.google.com/search-console
   - Bing Webmaster Tools: https://www.bing.com/webmasters
   - Submit your sitemap: https://yourdomain.com/sitemap.xml

2. **Set Up Analytics**
   - Google Analytics
   - Hostinger Analytics (built-in)

3. **Regular Backups**
   - Hostinger provides automatic backups
   - Download manual backups periodically via File Manager

4. **Monitor Performance**
   - Use Hostinger's built-in analytics
   - Check website speed with Google PageSpeed Insights

## Support Resources

- **Hostinger Knowledge Base**: https://support.hostinger.com
- **Hostinger Live Chat**: Available 24/7 in hPanel
- **Community Forum**: https://www.hostinger.com/forum

## Checklist Before Going Live

- [ ] All files uploaded to `public_html`
- [ ] `.htaccess` file present and working
- [ ] SSL certificate activated (HTTPS working)
- [ ] All pages loading correctly
- [ ] Images and videos displaying
- [ ] Slideshow working on homepage
- [ ] Contact forms tested (if applicable)
- [ ] Mobile responsiveness verified
- [ ] All links working (no 404 errors)
- [ ] Domain pointing to correct nameservers
- [ ] Email accounts configured (optional)
- [ ] Analytics set up (optional)
- [ ] Sitemap submitted to search engines

---

## Quick Upload Summary

**What to upload:** Everything in `c:\Users\sdkoe\Desktop\Website for Demo\`

**Where to upload:** Hostinger `public_html` folder

**How to upload:** 
- File Manager (easier) OR
- FTP/SFTP (faster for large files)

**After upload:**
- Visit your domain
- Test all functionality
- Enable SSL if not automatic

Your website is **100% ready** for Hostinger deployment! 🚀

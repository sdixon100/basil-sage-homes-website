# SSL Certificate Guide - Basil & Sage Homes

## 📜 Generated Certificates

Your custom SSL certificates have been successfully generated with a complete certificate chain.

### Certificate Structure

```
Root CA (10 years validity)
    └── Intermediate CA (5 years validity)
            └── Server Certificate (1 year validity)
                    └── Domain: basilandsagehomes.com
                        Alt Names: www.basilandsagehomes.com
                                  *.basilandsagehomes.com
```

---

## 📁 Generated Files

### Root Certificate Authority
- **root-ca.key** - Root CA Private Key (4096-bit) 🔒 KEEP SECURE
- **root-ca.crt** - Root CA Certificate (valid 10 years)
- **root-ca.srl** - Serial number file

### Intermediate Certificate Authority
- **intermediate-ca.key** - Intermediate CA Private Key (4096-bit) 🔒 KEEP SECURE
- **intermediate-ca.crt** - Intermediate CA Certificate (valid 5 years)
- **intermediate-ca.csr** - Certificate Signing Request
- **intermediate-ca.srl** - Serial number file

### Server Certificate
- **server.key** - Server Private Key (2048-bit) 🔒 KEEP SECURE
- **server.crt** - Server Certificate (valid 1 year)
- **server.csr** - Certificate Signing Request

### Certificate Bundles (Ready to Use)
- **chain.crt** - Server + Intermediate (most common for web servers)
- **fullchain.crt** - Server + Intermediate + Root (complete chain)
- **server-combined.pem** - Private Key + Certificate combined

### Configuration
- **openssl.cnf** - OpenSSL configuration used for generation

---

## 🚀 Usage Instructions

### For Apache Web Server

1. **Copy files to server:**
   ```bash
   server.key → /etc/ssl/private/
   chain.crt → /etc/ssl/certs/
   ```

2. **Configure Apache (httpd.conf or ssl.conf):**
   ```apache
   <VirtualHost *:443>
       ServerName basilandsagehomes.com
       ServerAlias www.basilandsagehomes.com
       
       SSLEngine on
       SSLCertificateFile /etc/ssl/certs/chain.crt
       SSLCertificateKeyFile /etc/ssl/private/server.key
       
       # Optional: Specify intermediate separately
       # SSLCertificateChainFile /etc/ssl/certs/intermediate-ca.crt
   </VirtualHost>
   ```

3. **Restart Apache:**
   ```bash
   sudo systemctl restart apache2
   # or
   sudo systemctl restart httpd
   ```

### For Nginx Web Server

1. **Copy files to server:**
   ```bash
   server.key → /etc/nginx/ssl/
   chain.crt → /etc/nginx/ssl/
   ```

2. **Configure Nginx:**
   ```nginx
   server {
       listen 443 ssl;
       server_name basilandsagehomes.com www.basilandsagehomes.com;
       
       ssl_certificate /etc/nginx/ssl/chain.crt;
       ssl_certificate_key /etc/nginx/ssl/server.key;
       
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
   }
   ```

3. **Test and reload:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### For Hostinger (cPanel/hPanel)

1. **Login to Hostinger hPanel**
2. **Navigate to:** Advanced → SSL/TLS
3. **Upload Certificate:**
   - **Private Key:** Paste contents of `server.key`
   - **Certificate:** Paste contents of `server.crt`
   - **Certificate Authority Bundle:** Paste contents of `intermediate-ca.crt`
4. **Save and activate**

### For IIS (Windows Server)

1. **Create PFX file:**
   ```powershell
   # Combine certificate and key into PFX
   openssl pkcs12 -export -out server.pfx -inkey server.key -in server.crt -certfile intermediate-ca.crt
   ```

2. **Import in IIS:**
   - Open IIS Manager
   - Server Certificates → Import
   - Select `server.pfx`
   - Enter password (if set)

3. **Bind to website:**
   - Select your site → Bindings
   - Add HTTPS binding on port 443
   - Select the imported certificate

---

## 🔐 Security Best Practices

### Private Key Protection

**CRITICAL:** Never expose private keys (.key files)

✅ **DO:**
- Store private keys in secure locations with restricted permissions
- Use `chmod 600` on Linux/Unix systems
- Keep backups in encrypted storage
- Never commit to Git (already in .gitignore)
- Never email or share via unsecured channels

❌ **DON'T:**
- Upload to public repositories
- Store in web-accessible directories
- Share via email or chat
- Leave with default permissions

### File Permissions (Linux/Unix)

```bash
# Private keys - owner read/write only
chmod 600 *.key

# Certificates - owner read/write, others read
chmod 644 *.crt

# Directory
chmod 700 /etc/ssl/private/
```

---

## 🔄 Certificate Renewal

Your server certificate is valid for **1 year**. To renew:

### Option 1: Generate New Server Certificate (Recommended)

```bash
# Run the generation script again
powershell -ExecutionPolicy Bypass -File ssl\generate-certificates.ps1
```

This creates a new server certificate while keeping the same CA chain.

### Option 2: Manual Renewal

```bash
# Generate new server key and CSR
openssl genrsa -out server-new.key 2048
openssl req -new -key server-new.key -out server-new.csr -config openssl.cnf

# Sign with intermediate CA
openssl x509 -req -in server-new.csr \
    -CA intermediate-ca.crt -CAkey intermediate-ca.key \
    -CAcreateserial -out server-new.crt \
    -days 365 -sha256 -extensions server_cert \
    -extfile openssl.cnf

# Replace old files
mv server-new.key server.key
mv server-new.crt server.crt
```

---

## 🧪 Testing Your Certificate

### Test with OpenSSL

```bash
# Verify certificate chain
openssl verify -CAfile root-ca.crt -untrusted intermediate-ca.crt server.crt

# Check certificate details
openssl x509 -in server.crt -text -noout

# Test HTTPS connection
openssl s_client -connect basilandsagehomes.com:443 -showcerts
```

### Test with Browser

1. **Install Root CA in browser** (for testing self-signed certs)
   - Chrome/Edge: Settings → Privacy and Security → Manage Certificates
   - Firefox: Settings → Privacy & Security → View Certificates
   - Import `root-ca.crt` as a trusted root certificate

2. **Visit your website**
   - https://basilandsagehomes.com
   - Check for green padlock icon
   - View certificate details

### Online Tools

- **SSL Labs:** https://www.ssllabs.com/ssltest/
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html

---

## 📋 Certificate Information

### Server Certificate Details

- **Common Name (CN):** basilandsagehomes.com
- **Subject Alternative Names:**
  - basilandsagehomes.com
  - www.basilandsagehomes.com
  - *.basilandsagehomes.com (wildcard)
- **Organization:** Basil and Sage Homes
- **Location:** Ladson, South Carolina, US
- **Key Algorithm:** RSA 2048-bit
- **Signature Algorithm:** SHA-256
- **Valid For:** 365 days

### Certificate Chain

1. **Root CA:** Basil and Sage Root CA (4096-bit, 10 years)
2. **Intermediate CA:** Basil and Sage Intermediate CA (4096-bit, 5 years)
3. **Server Certificate:** basilandsagehomes.com (2048-bit, 1 year)

---

## ⚠️ Important Notes

### Self-Signed Certificates

These are **self-signed certificates** suitable for:
- ✅ Development and testing environments
- ✅ Internal networks
- ✅ Learning and experimentation
- ✅ Staging servers

**NOT suitable for:**
- ❌ Production websites (browsers will show warnings)
- ❌ Public-facing e-commerce sites
- ❌ Sites requiring trusted SSL

### For Production Use

For production websites, use certificates from a trusted Certificate Authority:

**Free Options:**
- **Let's Encrypt** - Free, automated, 90-day certificates
  - https://letsencrypt.org
  - Hostinger provides free Let's Encrypt integration

**Paid Options:**
- DigiCert
- Sectigo (formerly Comodo)
- GlobalSign
- GoDaddy SSL

**Hostinger SSL:**
- Hostinger includes free SSL certificates
- Automatically managed and renewed
- Recommended for production use

---

## 🛠️ Troubleshooting

### Certificate Not Trusted

**Problem:** Browser shows "Not Secure" or certificate warning

**Solution:**
- For self-signed certs: Install `root-ca.crt` in browser/OS trust store
- For production: Use certificates from trusted CA (Let's Encrypt)

### Private Key Mismatch

**Problem:** Server won't start, key/certificate mismatch error

**Solution:**
```bash
# Verify key matches certificate
openssl x509 -noout -modulus -in server.crt | openssl md5
openssl rsa -noout -modulus -in server.key | openssl md5
# MD5 hashes should match
```

### Certificate Chain Issues

**Problem:** Incomplete certificate chain

**Solution:**
- Use `chain.crt` which includes server + intermediate
- Or specify intermediate separately in server config

### Permission Denied

**Problem:** Web server can't read certificate files

**Solution:**
```bash
# Fix permissions
sudo chown root:root server.key server.crt
sudo chmod 600 server.key
sudo chmod 644 server.crt
```

---

## 📞 Support

For Hostinger-specific SSL setup:
- **Hostinger Support:** 24/7 live chat at https://hpanel.hostinger.com
- **Knowledge Base:** https://support.hostinger.com/en/collections/1583355-ssl

For general SSL questions:
- **OpenSSL Documentation:** https://www.openssl.org/docs/
- **Mozilla SSL Config Generator:** https://ssl-config.mozilla.org/

---

## 🔄 Quick Reference

### Files to Use for Web Server
```
server.key  → Private key (KEEP SECURE!)
chain.crt   → Certificate bundle (server + intermediate)
```

### Files to Keep Safe
```
root-ca.key         → Root CA private key (NEVER share)
intermediate-ca.key → Intermediate CA private key (NEVER share)
server.key          → Server private key (NEVER share)
```

### Files You Can Share
```
root-ca.crt         → Root CA certificate
intermediate-ca.crt → Intermediate CA certificate
server.crt          → Server certificate
chain.crt           → Certificate bundle
```

---

**Generated:** January 12, 2026  
**Valid Until:** January 12, 2027 (server certificate)  
**Certificate Type:** Self-Signed (Development/Testing)

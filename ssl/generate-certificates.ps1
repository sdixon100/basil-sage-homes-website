# PowerShell Script to Generate SSL Certificates for basilandsagehomes.com
# This creates a complete certificate chain for development/testing

$domain = "basilandsagehomes.com"
$outputDir = "c:\Users\sdkoe\Desktop\Website for Demo\ssl"

Write-Host "Generating SSL Certificates for $domain..." -ForegroundColor Green
Write-Host "Output directory: $outputDir`n" -ForegroundColor Cyan

# Check if OpenSSL is available
$opensslPath = "C:\Program Files\Git\usr\bin\openssl.exe"
if (-not (Test-Path $opensslPath)) {
    # Try alternative paths
    $opensslPath = (Get-Command openssl -ErrorAction SilentlyContinue).Source
    if (-not $opensslPath) {
        Write-Host "ERROR: OpenSSL not found. Please install OpenSSL or Git for Windows." -ForegroundColor Red
        Write-Host "Git for Windows includes OpenSSL: https://git-scm.com/download/win" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "Using OpenSSL at: $opensslPath`n" -ForegroundColor Cyan

# Create OpenSSL configuration file
$configContent = @"
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=US
ST=South Carolina
L=Ladson
O=Basil and Sage Homes
OU=IT Department
CN=$domain

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = $domain
DNS.2 = www.$domain
DNS.3 = *.basilandsagehomes.com

[v3_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[v3_intermediate_ca]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[server_cert]
basicConstraints = CA:FALSE
nsCertType = server
nsComment = "OpenSSL Generated Server Certificate"
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
"@

Set-Content -Path "$outputDir\openssl.cnf" -Value $configContent

# 1. Generate Root CA Private Key
Write-Host "[1/7] Generating Root CA Private Key..." -ForegroundColor Yellow
& $opensslPath genrsa -out "$outputDir\root-ca.key" 4096 2>&1 | Out-Null
Write-Host "✓ Root CA Private Key created: root-ca.key" -ForegroundColor Green

# 2. Generate Root CA Certificate
Write-Host "[2/7] Generating Root CA Certificate..." -ForegroundColor Yellow
& $opensslPath req -x509 -new -nodes -key "$outputDir\root-ca.key" `
    -sha256 -days 3650 -out "$outputDir\root-ca.crt" `
    -subj "/C=US/ST=South Carolina/L=Ladson/O=Basil and Sage Homes/OU=Certificate Authority/CN=Basil and Sage Root CA" `
    -extensions v3_ca -config "$outputDir\openssl.cnf" 2>&1 | Out-Null
Write-Host "✓ Root CA Certificate created: root-ca.crt (valid 10 years)" -ForegroundColor Green

# 3. Generate Intermediate CA Private Key
Write-Host "[3/7] Generating Intermediate CA Private Key..." -ForegroundColor Yellow
& $opensslPath genrsa -out "$outputDir\intermediate-ca.key" 4096 2>&1 | Out-Null
Write-Host "✓ Intermediate CA Private Key created: intermediate-ca.key" -ForegroundColor Green

# 4. Generate Intermediate CA CSR
Write-Host "[4/7] Generating Intermediate CA Certificate Signing Request..." -ForegroundColor Yellow
& $opensslPath req -new -key "$outputDir\intermediate-ca.key" `
    -out "$outputDir\intermediate-ca.csr" `
    -subj "/C=US/ST=South Carolina/L=Ladson/O=Basil and Sage Homes/OU=Certificate Authority/CN=Basil and Sage Intermediate CA" `
    -config "$outputDir\openssl.cnf" 2>&1 | Out-Null
Write-Host "✓ Intermediate CA CSR created: intermediate-ca.csr" -ForegroundColor Green

# 5. Sign Intermediate CA Certificate with Root CA
Write-Host "[5/7] Signing Intermediate CA Certificate with Root CA..." -ForegroundColor Yellow
& $opensslPath x509 -req -in "$outputDir\intermediate-ca.csr" `
    -CA "$outputDir\root-ca.crt" -CAkey "$outputDir\root-ca.key" `
    -CAcreateserial -out "$outputDir\intermediate-ca.crt" `
    -days 1825 -sha256 -extensions v3_intermediate_ca `
    -extfile "$outputDir\openssl.cnf" 2>&1 | Out-Null
Write-Host "✓ Intermediate CA Certificate created: intermediate-ca.crt (valid 5 years)" -ForegroundColor Green

# 6. Generate Server Private Key
Write-Host "[6/7] Generating Server Private Key..." -ForegroundColor Yellow
& $opensslPath genrsa -out "$outputDir\server.key" 2048 2>&1 | Out-Null
Write-Host "✓ Server Private Key created: server.key" -ForegroundColor Green

# 7. Generate Server CSR
Write-Host "[7/7] Generating Server Certificate..." -ForegroundColor Yellow
& $opensslPath req -new -key "$outputDir\server.key" `
    -out "$outputDir\server.csr" `
    -config "$outputDir\openssl.cnf" 2>&1 | Out-Null

# Sign Server Certificate with Intermediate CA
& $opensslPath x509 -req -in "$outputDir\server.csr" `
    -CA "$outputDir\intermediate-ca.crt" -CAkey "$outputDir\intermediate-ca.key" `
    -CAcreateserial -out "$outputDir\server.crt" `
    -days 365 -sha256 -extensions server_cert `
    -extfile "$outputDir\openssl.cnf" 2>&1 | Out-Null
Write-Host "✓ Server Certificate created: server.crt (valid 1 year)" -ForegroundColor Green

# Create Certificate Bundle (Full Chain)
Write-Host "`nCreating Certificate Bundle..." -ForegroundColor Yellow
$serverCert = Get-Content "$outputDir\server.crt" -Raw
$intermediateCert = Get-Content "$outputDir\intermediate-ca.crt" -Raw
$rootCert = Get-Content "$outputDir\root-ca.crt" -Raw

# Full chain bundle (server + intermediate + root)
Set-Content -Path "$outputDir\fullchain.crt" -Value ($serverCert + "`n" + $intermediateCert + "`n" + $rootCert)
Write-Host "✓ Full chain bundle created: fullchain.crt" -ForegroundColor Green

# Chain bundle (server + intermediate only - most common for web servers)
Set-Content -Path "$outputDir\chain.crt" -Value ($serverCert + "`n" + $intermediateCert)
Write-Host "✓ Chain bundle created: chain.crt" -ForegroundColor Green

# Create combined PEM file (private key + certificate)
Set-Content -Path "$outputDir\server-combined.pem" -Value ((Get-Content "$outputDir\server.key" -Raw) + "`n" + $serverCert)
Write-Host "✓ Combined PEM created: server-combined.pem" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Certificate Generation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nGenerated Files:" -ForegroundColor White
Write-Host "  Root CA:" -ForegroundColor Cyan
Write-Host "    - root-ca.key (Root CA Private Key - KEEP SECURE!)"
Write-Host "    - root-ca.crt (Root CA Certificate)"
Write-Host "`n  Intermediate CA:" -ForegroundColor Cyan
Write-Host "    - intermediate-ca.key (Intermediate CA Private Key - KEEP SECURE!)"
Write-Host "    - intermediate-ca.crt (Intermediate CA Certificate)"
Write-Host "`n  Server Certificate:" -ForegroundColor Cyan
Write-Host "    - server.key (Server Private Key - KEEP SECURE!)"
Write-Host "    - server.crt (Server Certificate)"
Write-Host "    - server.csr (Certificate Signing Request)"
Write-Host "`n  Certificate Bundles:" -ForegroundColor Cyan
Write-Host "    - chain.crt (Server + Intermediate - for web servers)"
Write-Host "    - fullchain.crt (Server + Intermediate + Root)"
Write-Host "    - server-combined.pem (Private Key + Certificate)"

Write-Host "`nCertificate Details:" -ForegroundColor White
Write-Host "  Domain: $domain"
Write-Host "  Alt Names: www.$domain, *.$domain"
Write-Host "  Valid For: 1 year (server), 5 years (intermediate), 10 years (root)"
Write-Host "  Key Size: 2048-bit (server), 4096-bit (CAs)"

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. Use 'server.key' and 'chain.crt' for your web server"
Write-Host "  2. Keep all .key files secure and never commit to Git"
Write-Host "  3. For Hostinger, upload via SSL/TLS section in hPanel"
Write-Host "  4. See SSL_CERTIFICATE_GUIDE.md for detailed instructions"

Write-Host "`nSecurity Warning:" -ForegroundColor Red
Write-Host "  These are self-signed certificates for development/testing."
Write-Host "  For production, use certificates from a trusted CA (Let's Encrypt, etc.)"

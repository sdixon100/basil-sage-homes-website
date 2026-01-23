# PowerShell Script to Generate PEM Formatted SSL Certificate
# Creates a complete PEM certificate bundle for scottdixoncreative.com

$domain = "scottdixoncreative.com"
$outputDir = "c:\Users\sdkoe\Desktop\Website for Demo\ssl"

Write-Host "Generating PEM Formatted SSL Certificate for $domain..." -ForegroundColor Green
Write-Host "Output directory: $outputDir`n" -ForegroundColor Cyan

# Check if OpenSSL is available
$opensslPath = "C:\Program Files\Git\usr\bin\openssl.exe"
if (-not (Test-Path $opensslPath)) {
    $opensslPath = (Get-Command openssl -ErrorAction SilentlyContinue).Source
    if (-not $opensslPath) {
        Write-Host "ERROR: OpenSSL not found. Please install OpenSSL or Git for Windows." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Using OpenSSL at: $opensslPath`n" -ForegroundColor Cyan

# Create OpenSSL configuration file for scottdixoncreative.com
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
O=Scott Dixon Creative
OU=IT Department
CN=www.$domain

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = $domain
DNS.2 = www.$domain
DNS.3 = *.$domain

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

Set-Content -Path "$outputDir\scottdixoncreative-openssl.cnf" -Value $configContent

# 1. Generate Root CA Private Key
Write-Host "[1/7] Generating Root CA Private Key..." -ForegroundColor Yellow
& $opensslPath genrsa -out "$outputDir\scottdixoncreative-root-ca.key" 4096 2>&1 | Out-Null
Write-Host "  Root CA Private Key created: scottdixoncreative-root-ca.key" -ForegroundColor Green

# 2. Generate Root CA Certificate
Write-Host "[2/7] Generating Root CA Certificate..." -ForegroundColor Yellow
& $opensslPath req -x509 -new -nodes -key "$outputDir\scottdixoncreative-root-ca.key" `
    -sha256 -days 3650 -out "$outputDir\scottdixoncreative-root-ca.crt" `
    -subj "/C=US/ST=South Carolina/L=Ladson/O=Scott Dixon Creative/OU=Certificate Authority/CN=Scott Dixon Creative Root CA" `
    -extensions v3_ca -config "$outputDir\scottdixoncreative-openssl.cnf" 2>&1 | Out-Null
Write-Host "  Root CA Certificate created: scottdixoncreative-root-ca.crt" -ForegroundColor Green

# 3. Generate Intermediate CA Private Key
Write-Host "[3/7] Generating Intermediate CA Private Key..." -ForegroundColor Yellow
& $opensslPath genrsa -out "$outputDir\scottdixoncreative-intermediate-ca.key" 4096 2>&1 | Out-Null
Write-Host "  Intermediate CA Private Key created: scottdixoncreative-intermediate-ca.key" -ForegroundColor Green

# 4. Generate Intermediate CA CSR
Write-Host "[4/7] Generating Intermediate CA Certificate Signing Request..." -ForegroundColor Yellow
& $opensslPath req -new -key "$outputDir\scottdixoncreative-intermediate-ca.key" `
    -out "$outputDir\scottdixoncreative-intermediate-ca.csr" `
    -subj "/C=US/ST=South Carolina/L=Ladson/O=Scott Dixon Creative/OU=Certificate Authority/CN=Scott Dixon Creative Intermediate CA" `
    -config "$outputDir\scottdixoncreative-openssl.cnf" 2>&1 | Out-Null
Write-Host "  Intermediate CA CSR created: scottdixoncreative-intermediate-ca.csr" -ForegroundColor Green

# 5. Sign Intermediate CA Certificate with Root CA
Write-Host "[5/7] Signing Intermediate CA Certificate with Root CA..." -ForegroundColor Yellow
& $opensslPath x509 -req -in "$outputDir\scottdixoncreative-intermediate-ca.csr" `
    -CA "$outputDir\scottdixoncreative-root-ca.crt" -CAkey "$outputDir\scottdixoncreative-root-ca.key" `
    -CAcreateserial -out "$outputDir\scottdixoncreative-intermediate-ca.crt" `
    -days 1825 -sha256 -extensions v3_intermediate_ca `
    -extfile "$outputDir\scottdixoncreative-openssl.cnf" 2>&1 | Out-Null
Write-Host "  Intermediate CA Certificate created: scottdixoncreative-intermediate-ca.crt" -ForegroundColor Green

# 6. Generate Server Private Key
Write-Host "[6/7] Generating Server Private Key..." -ForegroundColor Yellow
& $opensslPath genrsa -out "$outputDir\scottdixoncreative-server.key" 2048 2>&1 | Out-Null
Write-Host "  Server Private Key created: scottdixoncreative-server.key" -ForegroundColor Green

# 7. Generate Server CSR and Certificate
Write-Host "[7/7] Generating Server Certificate..." -ForegroundColor Yellow
& $opensslPath req -new -key "$outputDir\scottdixoncreative-server.key" `
    -out "$outputDir\scottdixoncreative-server.csr" `
    -config "$outputDir\scottdixoncreative-openssl.cnf" 2>&1 | Out-Null

& $opensslPath x509 -req -in "$outputDir\scottdixoncreative-server.csr" `
    -CA "$outputDir\scottdixoncreative-intermediate-ca.crt" -CAkey "$outputDir\scottdixoncreative-intermediate-ca.key" `
    -CAcreateserial -out "$outputDir\scottdixoncreative-server.crt" `
    -days 365 -sha256 -extensions server_cert `
    -extfile "$outputDir\scottdixoncreative-openssl.cnf" 2>&1 | Out-Null
Write-Host "  Server Certificate created: scottdixoncreative-server.crt" -ForegroundColor Green

# Create PEM formatted certificate bundles
Write-Host "`nCreating PEM Certificate Bundles..." -ForegroundColor Yellow

$serverKey = Get-Content "$outputDir\scottdixoncreative-server.key" -Raw
$serverCert = Get-Content "$outputDir\scottdixoncreative-server.crt" -Raw
$intermediateCert = Get-Content "$outputDir\scottdixoncreative-intermediate-ca.crt" -Raw
$rootCert = Get-Content "$outputDir\scottdixoncreative-root-ca.crt" -Raw

# 1. Server certificate + key (PEM format)
Set-Content -Path "$outputDir\scottdixoncreative-server-combined.pem" -Value ($serverKey + "`n" + $serverCert) -NoNewline
Write-Host "  scottdixoncreative-server-combined.pem (Private Key + Server Certificate)" -ForegroundColor Green

# 2. Full chain certificate (PEM format)
Set-Content -Path "$outputDir\scottdixoncreative-fullchain.pem" -Value ($serverCert + "`n" + $intermediateCert + "`n" + $rootCert) -NoNewline
Write-Host "  scottdixoncreative-fullchain.pem (Server + Intermediate + Root)" -ForegroundColor Green

# 3. Chain certificate (PEM format)
Set-Content -Path "$outputDir\scottdixoncreative-chain.pem" -Value ($serverCert + "`n" + $intermediateCert) -NoNewline
Write-Host "  scottdixoncreative-chain.pem (Server + Intermediate)" -ForegroundColor Green

# 4. Complete PEM bundle (key + full chain)
Set-Content -Path "$outputDir\scottdixoncreative-complete.pem" -Value ($serverKey + "`n" + $serverCert + "`n" + $intermediateCert + "`n" + $rootCert) -NoNewline
Write-Host "  scottdixoncreative-complete.pem (Private Key + Full Certificate Chain)" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PEM Certificate Generation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nPEM Formatted Files:" -ForegroundColor White
Write-Host "  scottdixoncreative-complete.pem         - Private Key + Full Chain (all-in-one)" -ForegroundColor Cyan
Write-Host "  scottdixoncreative-server-combined.pem  - Private Key + Server Certificate" -ForegroundColor Cyan
Write-Host "  scottdixoncreative-fullchain.pem        - Server + Intermediate + Root Certificates" -ForegroundColor Cyan
Write-Host "  scottdixoncreative-chain.pem            - Server + Intermediate Certificates" -ForegroundColor Cyan

Write-Host "`nIndividual Certificate Files:" -ForegroundColor White
Write-Host "  scottdixoncreative-server.key           - Server Private Key (KEEP SECURE!)" -ForegroundColor Yellow
Write-Host "  scottdixoncreative-server.crt           - Server Certificate" -ForegroundColor Cyan
Write-Host "  scottdixoncreative-intermediate-ca.crt  - Intermediate CA Certificate" -ForegroundColor Cyan
Write-Host "  scottdixoncreative-root-ca.crt          - Root CA Certificate" -ForegroundColor Cyan

Write-Host "`nCertificate Details:" -ForegroundColor White
Write-Host "  Domain: www.$domain"
Write-Host "  Alt Names: $domain, www.$domain, *.$domain"
Write-Host "  Format: PEM (Privacy Enhanced Mail)"
Write-Host "  Validity: 1 year (server), 5 years (intermediate), 10 years (root)"
Write-Host "  Key Size: 2048-bit (server), 4096-bit (CAs)"

Write-Host "`nRecommended Usage:" -ForegroundColor Yellow
Write-Host "  For most web servers: Use 'scottdixoncreative-server.key' + 'scottdixoncreative-chain.pem'"
Write-Host "  For all-in-one setup: Use 'scottdixoncreative-complete.pem'"
Write-Host "  For Nginx/Apache: Use 'scottdixoncreative-server.key' + 'scottdixoncreative-fullchain.pem'"

Write-Host "`nSecurity Warning:" -ForegroundColor Red
Write-Host "  These are self-signed certificates for development/testing."
Write-Host "  For production, use certificates from a trusted CA (Let's Encrypt, etc.)"
Write-Host ""

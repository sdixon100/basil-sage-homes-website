import os
import re

def update_html_performance(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Unsplash preconnect with crossorigin
    content = content.replace(
        '<link rel="preconnect" href="https://images.unsplash.com">',
        '<link rel="preconnect" href="https://images.unsplash.com" crossorigin>'
    )

    # 2. Add fetchpriority="high" to styles.css if not already present
    content = content.replace(
        '<link rel="stylesheet" href="styles.css">',
        '<link rel="stylesheet" href="styles.css" fetchpriority="high">'
    )

    # 3. Add fetchpriority="high" to critical scripts
    content = content.replace(
        '<script type="module" src="scripts.js"></script>',
        '<script type="module" src="scripts.js" fetchpriority="high"></script>'
    )
    content = content.replace(
        '<link rel="modulepreload" href="scripts.js">',
        '<link rel="modulepreload" href="scripts.js" fetchpriority="high">'
    )

    # 4. Add fetchpriority="high" to the main logo
    content = content.replace(
        '<img src="basil-sage-logo.svg" alt="Basil & Sage Homes Logo">',
        '<img src="basil-sage-logo.svg" alt="Basil & Sage Homes Logo" fetchpriority="high">'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root_dir = os.getcwd()
    for filename in os.listdir(root_dir):
        if filename.endswith(".html"):
            print(f"Updating performance for {filename}...")
            update_html_performance(os.path.join(root_dir, filename))

if __name__ == "__main__":
    main()

import os
import re

HEADER_HTML = """  <header class="main-header">
    <nav class="nav-container">
      <a href="index.html" class="nav-logo">
        <img src="basil-sage-logo.svg" alt="Basil & Sage Homes Logo">
      </a>
      <button class="mobile-menu-btn" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="nav-menu">
        <ul class="nav-links">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="listings.html" class="nav-link">Properties</a></li>
          <li><a href="compare.html" class="nav-link">Compare</a></li>
          <li><a href="about.html" class="nav-link">About</a></li>
          <li><a href="testimonials.html" class="nav-link">Testimonials</a></li>
          <li><a href="contact.html" class="nav-link">Contact</a></li>
        </ul>
        <div class="nav-actions">
          <a href="#" class="btn-login">Login</a>
        </div>
      </div>
    </nav>
  </header>"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has main-header
    if '<header class="main-header">' in content:
        print(f"Skipping {filepath} (already updated)")
        return

    # Regex to find <nav> block
    # Matches <nav> or <nav class="..."> ... </nav>
    # Uses DOTALL to match across lines
    pattern = re.compile(r'<nav.*?>.*?</nav>', re.DOTALL)
    
    match = pattern.search(content)
    if match:
        print(f"Updating {filepath}...")
        new_content = pattern.sub(HEADER_HTML, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
    else:
        print(f"No nav found in {filepath}")

def main():
    root_dir = os.getcwd()
    for filename in os.listdir(root_dir):
        if filename.endswith(".html"):
            update_file(os.path.join(root_dir, filename))

if __name__ == "__main__":
    main()

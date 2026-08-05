import os
import re

def main():
    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()

    header_match = re.search(r'(<!-- Header -->\s*<header.*?</header>)', index_html, re.DOTALL)
    if not header_match:
        print("Could not find header in index.html")
        return
    
    header_html = header_match.group(1)

    tailwind_script = """
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            corePlugins: { preflight: false },
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        'forest': '#1B4332',
                        'accent': '#52B788',
                        'leaf': '#40916C',
                    }
                }
            }
        }
    </script>
"""

    for root, dirs, files in os.walk('.'):
        if 'node_modules' in root or '.git' in root: continue
        for file in files:
            if file.endswith('.html') and file != 'index.html':
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                depth = filepath.count(os.sep) - 1
                if depth < 0: depth = 0
                prefix = '../' * depth if depth > 0 else ''
                
                local_header = header_html
                # Handle prefixes for links and assets
                if prefix:
                    local_header = local_header.replace('href="index.html"', f'href="{prefix}index.html"')
                    local_header = local_header.replace('src="assets/logo.png"', f'src="{prefix}assets/logo.png"')
                    
                    pages = [
                        "jobs-in-kochi.html", "fresher-jobs-kochi.html", "part-time-jobs-kochi.html", 
                        "part-time-jobs-for-students-kochi.html", "work-from-home-jobs-kochi.html",
                        "night-shift-jobs-kochi.html", "urgent-jobs-kochi.html", "infopark-jobs-kochi.html",
                        "data-entry-jobs-kochi.html", "accountant-jobs-kochi.html", 
                        "digital-marketing-jobs-kochi.html", "driver-jobs-kochi.html"
                    ]
                    for page in pages:
                        local_header = local_header.replace(f'href="{page}"', f'href="{prefix}{page}"')

                # Replace the old header with the new one
                content = re.sub(r'<header class="site-header">.*?</header>', local_header, content, flags=re.DOTALL)
                
                if 'cdn.tailwindcss.com' not in content:
                    content = content.replace('</head>', f'{tailwind_script}</head>')
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated header in {filepath}")

if __name__ == '__main__':
    main()

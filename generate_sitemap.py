import os
from datetime import datetime

def generate_sitemap():
    base_url = "https://keralajobhub.com/"
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Start of XML
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    found_urls = []
    
    # Add home page first
    xml_lines.append("  <url>")
    xml_lines.append(f"    <loc>{base_url}</loc>")
    xml_lines.append(f"    <lastmod>{today}</lastmod>")
    xml_lines.append("    <priority>1.0</priority>")
    xml_lines.append("  </url>")
    
    # Find all HTML files recursively
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Exclude hidden directories
        dirnames[:] = [d for d in dirnames if not d.startswith('.')]
        
        # Exclude specific folders like assets or google verification files
        if any(ignored in dirpath.replace(root_dir, '').split(os.sep) for ignored in ['assets', 'assest']):
            continue
            
        for filename in filenames:
            if filename.endswith(".html"):
                # Skip index.html because we already handled home page at root
                if filename == "index.html" and dirpath == root_dir:
                    continue
                
                # Skip Google verification file
                if filename.startswith("google"):
                    continue
                    
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir)
                
                # Convert Windows path backslash to forward slash
                url_path = rel_path.replace(os.sep, '/')
                full_url = f"{base_url}{url_path}"
                found_urls.append(full_url)
                
    # Sort alphabetically
    found_urls.sort()
    
    for url in found_urls:
        priority = "0.8"
        if "companies/" in url:
            priority = "0.7"
            
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{url}</loc>")
        xml_lines.append(f"    <lastmod>{today}</lastmod>")
        xml_lines.append(f"    <priority>{priority}</priority>")
        xml_lines.append("  </url>")
        
    xml_lines.append("</urlset>")
    
    # Write file
    sitemap_path = os.path.join(root_dir, "sitemap.xml")
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write("\n".join(xml_lines) + "\n")
        
    print(f"Successfully generated sitemap with {len(found_urls) + 1} URLs at {sitemap_path}")

if __name__ == "__main__":
    generate_sitemap()

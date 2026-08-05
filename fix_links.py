import os
import re
import urllib.parse

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all wa.me links
    def replacer(match):
        full_url = match.group(0)
        # Only modify if it contains 'I am interested in'
        if 'interested' in full_url.lower():
            # Extract the job title. e.g. text=I am interested in the [Job Title] job listed...
            match_text = re.search(r'text=([^\"&]+)', full_url)
            if match_text:
                text_val = urllib.parse.unquote(match_text.group(1))
                # Try to extract just the job title
                job_match = re.search(r'interested in (the )?(.*?) job', text_val, re.IGNORECASE)
                if job_match:
                    job_title = job_match.group(2).strip()
                else:
                    job_title = text_val.replace('I am interested in ', '').strip()
                
                # Replace with index.html redirect
                new_url = f'index.html?apply={urllib.parse.quote(job_title)}'
                return new_url
        return full_url

    new_content = re.sub(r'https://wa\.me/[^\"]+', replacer, content)
    
    # Special fix for any absolute paths if they were used
    # But usually they are just href="https://wa.me/..."
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root: continue
    for file in files:
        if file.endswith('.html') and file != 'index.html':
            process_file(os.path.join(root, file))
print('Done!')

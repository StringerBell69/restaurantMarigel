#!/usr/bin/env python3
import re
import sys

def fix_quotes_in_jsx(content):
    """Replace curly quotes and apostrophes with HTML entities, but only in JSX text content."""

    # Replace curly apostrophes (U+2019) with straight ones
    content = content.replace('\u2019', "'")
    # Replace left and right double quotation marks with straight double quotes
    content = content.replace('\u201C', '"').replace('\u201D', '"')

    # Now replace straight apostrophes in JSX text with &apos;
    # This regex matches text between > and <, and replaces apostrophes in those sections
    def replace_apostrophe_in_jsx(match):
        text = match.group(0)
        # Don't replace if it's inside a JSX attribute or JavaScript code
        if "'" in text and not ('{' in text or 'className=' in text or 'href=' in text):
            return text.replace("'", "&apos;")
        return text

    # Match content between tags
    content = re.sub(r'>[^<>{}]+<', replace_apostrophe_in_jsx, content)

    return content

if __name__ == '__main__':
    filename = sys.argv[1]
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    fixed_content = fix_quotes_in_jsx(content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(fixed_content)

    print(f"Fixed {filename}")

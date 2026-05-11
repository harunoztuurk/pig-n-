import os
import re

games_dir = 'games'
games = [d for d in os.listdir(games_dir) if os.path.isdir(os.path.join(games_dir, d))]

css_link = '<link rel="stylesheet" href="../../css/global.css">'
scanline = '<div class="scanline"></div>'
fonts_link = '<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">'

for game in games:
    html_path = os.path.join(games_dir, game, 'index.html')
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Add fonts if missing
        if 'Share+Tech+Mono' not in content:
            if '</head>' in content:
                content = content.replace('</head>', f'    {fonts_link}\n</head>')
                
        # Add global.css if missing
        if 'global.css' not in content:
            if '</head>' in content:
                content = content.replace('</head>', f'    {css_link}\n</head>')
                
        # Add scanline if missing
        if 'class="scanline"' not in content and "class='scanline'" not in content:
            if '<body>' in content:
                content = content.replace('<body>', f'<body>\n    {scanline}')
            elif '<body' in content:
                # Find the end of the body tag
                body_end = content.find('>', content.find('<body')) + 1
                content = content[:body_end] + f'\n    {scanline}' + content[body_end:]
                
        if content != original_content:
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {game}')

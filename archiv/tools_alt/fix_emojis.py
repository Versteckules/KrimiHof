import os
import sys

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    fixes = {
        "ðŸ”“": "🔓",
        "ðŸŽ": "🎁",
        "ðŸ †": "🏆",
        "ðŸ—£ï¸ ": "🗣️",
        "ðŸ” ": "🔎",
        "ðŸ“–": "📖",
        "ðŸ“ž": "📞",
        "ðŸŽ©": "🎩",
        "ðŸ•¶ï¸ ": "🕶️",
        "ðŸ§”": "🧔",
        "ðŸ§¢": "🧢",
        "ðŸ•µï¸ ": "🕵️",
        "ðŸ‘·": "👷",
        "ðŸ˜ ": "😠",
        "ðŸ˜³": "😳",
        "ðŸ§ ": "🧐",
        "ðŸ‘„": "👄",
        "ðŸ¥¸": "🥺",
        "ðŸ˜ ": "😐"
    }

    new_content = content
    for bad, good in fixes.items():
        new_content = new_content.replace(bad, good)

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {path}")

def main():
    root_dir = r"c:\Users\flaem\Desktop\Krimi"
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html') or file.endswith('.js') or file.endswith('.json') or file.endswith('.css'):
                fix_file(os.path.join(subdir, file))

if __name__ == '__main__':
    main()

import json

with open('data/stations.json', 'r', encoding='utf8') as f:
    stations = json.load(f)
charmap = {}
for s in stations:
    for c in s.get('characters', []):
        charmap[c['name']] = c['image']

with open('data/story.json', 'r', encoding='utf8') as f:
    story = json.load(f)

changed = False
for key, nodes in story.items():
    if isinstance(nodes, list):
        for node in nodes:
            speaker = node.get('speaker')
            if speaker in charmap:
                if node.get('avatar') != charmap[speaker]:
                    print(f"Fixing {speaker}: {node.get('avatar')} -> {charmap[speaker]}")
                    node['avatar'] = charmap[speaker]
                    changed = True

if changed:
    with open('data/story.json', 'w', encoding='utf8') as f:
        json.dump(story, f, indent=2, ensure_ascii=False)

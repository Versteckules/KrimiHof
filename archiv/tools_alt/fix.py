import io
fixes = {
  'Ã¤': 'ä', 'Ã¼': 'ü', 'Ã¶': 'ö', 'ÃŸ': 'ß',
  'Ã„': 'Ä', 'Ãœ': 'Ü', 'Ã–': 'Ö', 'Ã©': 'é',
  'Ã³': 'ó', 'Â°': '°'
}
with io.open(r'..\data\stations.json', 'r', encoding='utf-8') as f:
    text = f.read()
for bad, good in fixes.items():
    text = text.replace(bad, good)
with io.open(r'..\data\stations.json', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed stations.json!')

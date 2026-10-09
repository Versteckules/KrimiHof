import json
import os

with open(r'c:\Users\flaem\Desktop\Krimi\data\story.json', 'r', encoding='utf-8') as f:
    story = json.load(f)

md_lines = []
md_lines.append("# Der Pakt der Schlappen-Erben: Vollständiges Dialog- & Textbuch")
md_lines.append(f"**Generiert:** Stand Oktober 2026  ")
md_lines.append(f"**Umfang:** 22 Dialogbäume, 248 Verhör-Knoten, 17 Story-Audios  \n")
md_lines.append("---\n")

md_lines.append("## 1. Prolog & Rahmenhandlung\n")
prologue = story.get('prologue', {})
md_lines.append(f"### {prologue.get('heading', 'Prolog')}")
md_lines.append(f"{prologue.get('text', '')}\n")

md_lines.append("## 2. Die 3 Hauptverdächtigen & Motive\n")
suspects = story.get('suspects', {})
for sid, s in suspects.items():
    md_lines.append(f"### {s.get('name')} (`{sid}`)")
    md_lines.append(f"* **Rolle:** {s.get('role')}")
    md_lines.append(f"* **Alter:** {s.get('age')} Jahre | **Ort:** {s.get('location')} ({s.get('coords')})")
    md_lines.append(f"* **Motiv:** {s.get('motive')}")
    md_lines.append(f"* **Schlüssel-Beweis:** {s.get('evidenceKey')}")
    md_lines.append(f"* **Beschreibung:** {s.get('description')}\n")

md_lines.append("## 3. Die Geständnisse im Finale (Endings)\n")
endings = story.get('endings', {})
for sid, e in endings.items():
    sname = suspects.get(sid, {}).get('name', sid)
    md_lines.append(f"### Geständnis von {sname}:")
    md_lines.append(f"> „{e.get('confession')}“\n")

md_lines.append("---\n")
md_lines.append("## 4. Sämtliche 22 Verhör- & Dialogbäume im Detail\n")

trees = story.get('dialogueTrees', {})
tree_idx = 1
for tree_key, nodes in trees.items():
    first_speaker = nodes[0].get('speaker', 'Unbekannt') if nodes else 'Unbekannt'
    md_lines.append(f"### Dialogbaum {tree_idx}: `{tree_key}` — {first_speaker}")
    md_lines.append(f"*Knotenanzahl: {len(nodes)}*\n")
    
    for n in nodes:
        node_id = n.get('id', 'node')
        speaker = n.get('speaker', 'Unbekannt')
        text = n.get('text', '')
        audio = n.get('audio', 'Kein Audio')
        is_end = n.get('isEnd', False)
        
        md_lines.append(f"#### 📍 Knoten `[{node_id}]` — **{speaker}**")
        md_lines.append(f"> „{text}“\n")
        md_lines.append(f"* **Audio:** `{audio}`")
        if is_end:
            outcome = n.get('outcome', 'Gesprächsende')
            reward = n.get('reward')
            md_lines.append(f"* **Status:** 🏁 GESPRÄCHSENDE ({outcome})" + (f" | 🎁 Belohnung: `{reward}`" if reward else ""))
        
        choices = n.get('choices', [])
        if choices:
            md_lines.append("* **Antwortmöglichkeiten des Spielers:**")
            for c in choices:
                c_text = c.get('text', '')
                next_id = c.get('next', 'Ende')
                impact = c.get('impact')
                req_ev = c.get('requires_evidence')
                contra = c.get('contradiction_target')
                
                details = []
                if next_id: details.append(f"führt zu `[{next_id}]`")
                if impact: details.append(f"Impact: {impact.get('suspect')} +{impact.get('value')}%")
                if contra: details.append("⚡ WIDERSPRUCH ENTDECKT (+15 Pkt)")
                if req_ev: details.append(f"Benötigt Beweis: `{req_ev}`")
                
                detail_str = f" *({', '.join(details)})*" if details else ""
                md_lines.append(f"  * 💬 {c_text}{detail_str}")
        md_lines.append("")
    md_lines.append("---\n")
    tree_idx += 1

out_path = r'c:\Users\flaem\Desktop\Krimi\backup\ALLE_DIALOGE_UND_TEXTE.md'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(md_lines))

print(f"Markdown-Export erfolgreich: {out_path} ({os.path.getsize(out_path)} Bytes)")

# Archiv — Cloudflare-Vorstudie, 31.07.2026

Sechs Bilder, erzeugt über Cloudflare Workers AI (`@cf/black-forest-labs/flux-1-schnell`).
**Ersetzt und nicht mehr in Gebrauch.** Für die Produktion zählt ausschließlich, was über die
BFL-API nach `_reference/art-production-plan.md` entsteht.

Warum sie trotzdem liegen bleiben: Sie sind der Beleg für drei Befunde, die den Produktionsplan
geformt haben.

1. Der Anbieter liefert 1024×1024, wenn man keine Größe verlangt — die ersten drei sind quadratisch
   statt 16:9.
2. Er liefert JPEG, obwohl nichts davon die Rede war.
3. **„no text, no watermark" im Prompt erzeugt Text.** Vier von sechs Bildern trugen erfundene
   Beschriftungen oder eine Wasserzeichen-Attrappe. Die Gegenprobe ohne die Verneinung kam sauber
   heraus. Daraus wurde die Regel, dass kein Prompt dieses Projekts eine Verneinung enthält.

Nicht als Stilreferenz verwenden — anderes Modell, anderer Look.

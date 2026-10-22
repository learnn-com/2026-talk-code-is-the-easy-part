import subprocess, sys, os, json, pathlib

SRC = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(sys.argv[2])
ONLY = sys.argv[3:] or None
HERE = pathlib.Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP = HERE / "tmp"
TMP.mkdir(exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

HEAD, FOOT, PAGE = 100, 310, 2060


def size(p):
    w, h = subprocess.check_output(["magick", "identify", "-format", "%w %h", str(p)]).split()
    return int(w), int(h)


def pages(img):
    w, h = size(img)
    s = w / 1640
    norm = TMP / f"{img.stem}_norm.png"
    subprocess.run(["magick", str(img), "-resize", "1640x", str(norm)], check=True)
    h = round(h / s)
    body = PAGE - HEAD - FOOT
    c0, c1 = HEAD, h - FOOT
    if c1 - c0 <= body + 40:
        out = TMP / f"{img.stem}_p1.png"
        subprocess.run(["magick", str(norm), "-background", "white", "-gravity", "north",
                        "-extent", f"1640x{max(h, PAGE)}", str(out)], check=True)
        return [out]
    starts, y, step = [], c0, body - 220
    while y + body < c1:
        starts.append(y)
        y += step
    starts.append(c1 - body)
    res = []
    for i, y in enumerate(starts, 1):
        out = TMP / f"{img.stem}_p{i}.png"
        subprocess.run(["magick", str(norm),
                        "(", "-clone", "0", "-crop", f"1640x{HEAD}+0+0", ")",
                        "(", "-clone", "0", "-crop", f"1640x{body}+0+{y}", ")",
                        "(", "-clone", "0", "-crop", f"1640x{FOOT}+0+{h - FOOT}", ")",
                        "-delete", "0", "+repage", "-append", str(out)], check=True)
        res.append(out)
    return res


PARENT = """<p><span class="mention">@Claude</span> /pair-process-brainstorm<br>Repo: learnn-com/2026-talk-code-is-the-easy-part.git<br>Theme: primo sprint dell'MVP Learnn (1 settimana), partendo dal PRD e dai bounded context in .pair/adoption.</p>
<p>Obiettivo dello sprint:<br>Un prototipo funzionante dell'app, production ready, che usa servizi mock al posto dei backend reali.</p>
<p>Prodotto (funzionalità del primo sprint):</p><ul><li>Login: maschera per inserire le credenziali (email e password) con verifica, e messaggio di errore in caso di credenziali sbagliate.</li><li>Home:<ul><li>header con logo e avatar utente, che porta alle notifiche;</li><li>slider di corsi e webinar divisi a puntate (contenuti multipli);</li><li>slider di contenuti singoli divisi per categoria.</li></ul></li><li>Tutti i dati sono mock.</li></ul>
<p>Contesto:</p><ul><li>Usa PRD, sottodomini e bounded context del repo. Il PRD non si modifica.</li><li>Se le specifiche sopra divergono dal PRD, il PRD prevale: segnalalo e chiedimi conferma.</li><li>L'iniziativa coincide con l'obiettivo di prodotto: app funzionante entro 90 giorni, secondo il PRD. Il primo sprint (1 settimana) è la prima iterazione dell'iniziativa.</li></ul>
<p>Vincoli del primo sprint (non vanno discussi, solo rispettati):</p><ul><li>Niente database reale e niente backend complesso: dati mock.</li><li>Nessuna feature fuori dalla Fase 1 del PRD.</li><li>Acceptance criteria osservabili e verificabili, a livello di schermata/azione.</li></ul>
<p>Partecipanti: <span class="mention">@Omar</span>, <span class="mention me">@Gianluca</span> rispondono come prodotto e stakeholder.</p>
<p>Modalità:</p><ul><li>Una domanda per volta, sempre con una tua raccomandazione.</li><li>Se una risposta è già deducibile da PRD, sottodomini o bounded context, non chiederla: proponila e chiedi solo conferma.</li></ul>
<p>Chiusura:</p><ul><li>Chiudi il grilling con gli acceptance criteria condivisi, prima di creare qualsiasi card.</li><li>Crea le card solo dopo la conferma esplicita di Omar e Gianluca.</li></ul>"""

ICON = {
    "home": '<svg viewBox="0 0 20 20"><path d="M3 9.5 10 3l7 6.5V17h-4.5v-4.5h-5V17H3z" fill="currentColor"/></svg>',
    "dm": '<svg viewBox="0 0 20 20"><path d="M3 4h14v9H8l-4 3.5V13H3z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    "bell": '<svg viewBox="0 0 20 20"><path d="M10 3a4.5 4.5 0 0 0-4.5 4.5V11L4 13.5h12L14.5 11V7.5A4.5 4.5 0 0 0 10 3zm-2 12a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    "file": '<svg viewBox="0 0 20 20"><path d="M5 2.5h6l4 4v11H5z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    "more": '<svg viewBox="0 0 20 20"><circle cx="4" cy="10" r="1.6" fill="currentColor"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/><circle cx="16" cy="10" r="1.6" fill="currentColor"/></svg>',
    "search": '<svg viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m12.5 12.5 4 4" stroke="currentColor" stroke-width="1.6"/></svg>',
    "thread": '<svg viewBox="0 0 20 20"><path d="M3 4h14v9H8l-4 3.5V13H3z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
}

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:%(W)dpx;height:%(H)dpx;overflow:hidden}
body{font-family:Lato,'Helvetica Neue',Arial,sans-serif;background:linear-gradient(160deg,#4a154b 0%%,#3f0e40 55%%,#350d36 100%%);color:#1d1c1d;-webkit-font-smoothing:antialiased}
.top{height:40px;display:flex;align-items:center;justify-content:center;position:relative}
.dots{position:absolute;left:14px;top:13px;display:flex;gap:8px}.dots i{width:12px;height:12px;border-radius:50%%;display:block}
.search{width:%(SW)dpx;height:26px;border-radius:6px;background:rgba(255,255,255,.18);color:rgba(255,255,255,.85);font-size:13px;display:flex;align-items:center;gap:8px;padding:0 10px}
.search svg{width:14px;height:14px}
.wrap{display:flex;height:calc(100%% - 40px);padding:0 6px 6px 0}
.rail{width:70px;display:flex;flex-direction:column;align-items:center;gap:14px;padding-top:6px;color:#fff}
.ws{width:36px;height:36px;border-radius:8px;background:#fff;color:#3f0e40;font-weight:900;font-size:18px;display:flex;align-items:center;justify-content:center}
.ri{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;font-weight:700;opacity:.85}
.ri b{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center}
.ri.on b{background:rgba(255,255,255,.22)}.ri.on{opacity:1}
.ri svg{width:20px;height:20px}
.side{width:260px;background:rgba(255,255,255,.06);border-radius:8px 0 0 8px;color:rgba(255,255,255,.78);font-size:15px;padding:12px 8px}
.side h1{color:#fff;font-size:18px;font-weight:900;padding:4px 10px 14px;display:flex;align-items:center;gap:6px}
.side .it{height:28px;display:flex;align-items:center;gap:8px;padding:0 10px;border-radius:6px}
.side .it.on{background:rgba(255,255,255,.92);color:#3f0e40;font-weight:700}
.side .sec{margin:14px 0 4px;padding:0 10px;font-size:15px;color:rgba(255,255,255,.7)}
.side .h{width:16px;text-align:center;opacity:.8}
.side .av{width:20px;height:20px;border-radius:4px;background-size:cover}
.side .ini{width:20px;height:20px;border-radius:4px;color:#fff;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center}
.main{flex:1;background:#fff;border-radius:0 8px 8px 0;display:flex;overflow:hidden}
.chan{flex:1;display:flex;flex-direction:column;min-width:0;border-right:1px solid #e2e2e2}
.ch{height:49px;border-bottom:1px solid #e2e2e2;display:flex;align-items:center;padding:0 18px;font-size:18px;font-weight:900;gap:6px}
.ch .mem{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#616061;border:1px solid #ddd;border-radius:6px;padding:3px 8px 3px 4px}
.ch .mem i{width:20px;height:20px;border-radius:4px;background-size:cover;display:block;margin-right:-10px;border:2px solid #fff}
.tabs{height:38px;border-bottom:1px solid #e2e2e2;display:flex;gap:22px;padding:0 18px;font-size:14px;color:#616061;align-items:flex-end}
.tabs span{padding-bottom:9px}.tabs .on{color:#1d1c1d;font-weight:700;border-bottom:2px solid #1d1c1d}
.msgs{flex:1;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:0 0 10px}
.day{display:flex;align-items:center;margin:8px 0}.day:before,.day:after{content:"";flex:1;border-top:1px solid #e2e2e2}
.day span{border:1px solid #e2e2e2;border-radius:24px;padding:3px 14px;font-size:13px;font-weight:700}
.msg{display:flex;gap:8px;padding:6px 20px;font-size:14px;line-height:1.4}
.msg.hl{background:#f8f8f8}
.msg .a{width:36px;height:36px;border-radius:6px;background-size:cover;flex:none;margin-top:4px}
.msg .n{font-weight:900}.msg .t{font-size:12px;color:#616061;margin-left:6px}
.msg p{margin:0 0 4px}.msg ul{margin:0 0 4px 24px}.msg ul ul{list-style:circle}
.mention{background:#e8f5fa;color:#1264a3;border-radius:3px;padding:0 2px}.mention.me{background:#fcefc4;color:#1d1c1d}
.re{display:inline-flex;align-items:center;gap:4px;border:1px solid #1d9bd1;background:#e8f5fa;border-radius:12px;padding:1px 8px;font-size:12px;color:#1264a3;margin:2px 0 6px}
.rep{display:flex;align-items:center;gap:6px;font-size:13px;margin-top:2px}
.rep i{width:24px;height:24px;border-radius:4px;background-size:cover;display:block}
.rep b{color:#1264a3;font-weight:900}.rep span{color:#616061}
.comp{margin:0 20px 18px;border:1px solid #bbbabb;border-radius:8px;height:86px;padding:10px 12px;color:#868686;font-size:15px}
.thread{width:820px;flex:none;background:#fff;overflow:hidden}
.thread img{width:820px;display:block}
"""


def side(full):
    av = lambda n: f'<span class="av" style="background-image:url(file://{HERE}/av-{n}.png)"></span>'
    return f"""<div class="side"><h1>Learnn <small style="font-size:12px">▾</small></h1>
<div class="it"><span class="h">{ICON['thread'].replace('svg ','svg style="width:16px;height:16px" ')}</span>Thread</div>
<div class="it"><span class="h">◎</span>Huddle</div>
<div class="it"><span class="h">➤</span>Bozze e inviati</div>
<div class="sec">▾ Canali</div>
<div class="it"><span class="h">#</span>general</div>
<div class="it on"><span class="h">#</span>a-team-tech</div>
<div class="it"><span class="h">#</span>product</div>
<div class="it"><span class="h">#</span>random</div>
<div class="sec">▾ Messaggi diretti</div>
<div class="it">{av('omar')}Omar Diop</div>
<div class="it"><span class="ini" style="background:#2b7a78">LP</span>Luca Pirrone</div>
<div class="it"><span class="ini" style="background:#9b51e0">LM</span>Luca Mastella</div>
<div class="sec">▾ App</div>
<div class="it">{av('claude')}Claude</div></div>"""


def html(page, mode):
    W, H = (1920, 1080) if mode == "A" else (1170, 1080)
    rail = f"""<div class="rail"><div class="ws">L</div>
<div class="ri on"><b>{ICON['home']}</b>Home</div><div class="ri"><b>{ICON['dm']}</b>DM</div>
<div class="ri"><b>{ICON['bell']}</b>Attività</div><div class="ri"><b>{ICON['file']}</b>File</div><div class="ri"><b>{ICON['more']}</b>Altro</div></div>"""
    chan = ""
    if mode == "A":
        u = lambda n: f"url(file://{HERE}/av-{n}.png)"
        chan = f"""<div class="chan"><div class="ch"># a-team-tech <small style="font-size:12px;color:#616061">▾</small>
<div class="mem"><i style="background-image:{u('omar')}"></i><i style="background-image:{u('gianluca')}"></i><i style="background-image:{u('claude')}"></i><span style="margin-left:12px">12</span></div></div>
<div class="tabs"><span class="on">Messaggi</span><span>Canvas</span><span>File</span></div>
<div class="msgs"><div class="day"><span>Oggi</span></div>
<div class="msg hl"><div class="a" style="background-image:{u('gianluca')}"></div><div><div><span class="n">Gianluca</span><span class="t">6:49 PM</span></div>{PARENT}
<div class="re">👀 1</div>
<div class="rep"><i style="background-image:{u('claude')}"></i><i style="background-image:{u('omar')}"></i><i style="background-image:{u('gianluca')}"></i><b>33 risposte</b><span>Ultima risposta oggi alle 7:09 PM</span></div></div></div></div>
<div class="comp">Scrivi a #a-team-tech</div></div>"""
    css = CSS % {"W": W, "H": H, "SW": 620 if mode == "A" else 420}
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=block" rel="stylesheet">
<style>{css}</style></head><body>
<div class="top"><div class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>
<div class="search">{ICON['search']}Cerca in Learnn</div></div>
<div class="wrap">{rail}{side(mode)}<div class="main">{chan}<div class="thread"><img src="file://{page}"></div></div></div>
</body></html>""", W, H


def shot(htmlstr, W, H, out):
    f = TMP / "page.html"
    f.write_text(htmlstr)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
                    f"--window-size={W},{H}", "--force-device-scale-factor=2", "--virtual-time-budget=4000",
                    f"--screenshot={out}", f"file://{f}"], check=True, capture_output=True)


for img in sorted(SRC.glob("*.png")):
    if ONLY and img.stem not in ONLY:
        continue
    ps = pages(img)
    for i, p in enumerate(ps, 1):
        suf = f"-p{i}" if len(ps) > 1 else ""
        for mode, name in (("A", "canale-thread"), ("B", "thread")):
            h, W, H = html(p, mode)
            out = OUT / name / f"{img.stem}{suf}.png"
            out.parent.mkdir(exist_ok=True)
            shot(h, W, H, out)
            print(out)

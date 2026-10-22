import subprocess, sys, pathlib
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
D=pathlib.Path(sys.argv[1]); OUT=pathlib.Path(sys.argv[2]); OUT.mkdir(exist_ok=True)
PH=(D/"photo.png").as_uri()
CSS="""
*{box-sizing:border-box;margin:0;padding:0}
body{background:#fff;width:430px;height:884px;display:flex;align-items:center;justify-content:center;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}
.phone{width:410px;height:864px;border-radius:58px;background:#1c1c1e;padding:12px;box-shadow:0 0 0 2px #3a3a3c inset}
.scr{width:100%;height:100%;border-radius:47px;background:#000;color:#fff;overflow:hidden;position:relative}
.sb{height:48px;display:flex;justify-content:space-between;align-items:center;padding:14px 30px 0;font-size:15px;font-weight:600}
.isl{position:absolute;top:11px;left:50%;transform:translateX(-50%);width:110px;height:32px;border-radius:20px;background:#1c1c1e}
.hd{display:flex;align-items:center;justify-content:space-between;padding:10px 18px 14px;border-bottom:1px solid #222}
.logo{font-size:28px;font-weight:700;letter-spacing:-.5px}
.ic{display:flex;gap:16px;align-items:center}
.bell{position:relative;width:30px;height:30px}
.badge{position:absolute;top:-4px;right:-6px;background:#ff2d2d;color:#fff;font-size:11px;font-weight:700;border-radius:10px;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;padding:0 4px}
.av{width:36px;height:36px;border-radius:50%;background:#333 center/cover;border:1.5px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
.sec{padding:16px 0 0 18px}
.st{font-size:18px;margin-bottom:10px}
.row{display:flex;gap:12px;overflow:hidden}
.card{width:150px;flex:none}
.cov{width:150px;height:187px;border-radius:12px;background:url(%PH%) center/cover;position:relative;border:1px solid #333}
.tag{position:absolute;top:8px;left:8px;font-size:9px;font-weight:700;border:1px solid #fff;border-radius:4px;padding:2px 5px;background:rgba(0,0,0,.35)}
.ep{position:absolute;bottom:6px;right:8px;font-size:18px;font-weight:700}
.ct{font-size:14px;font-weight:700;margin-top:7px}
.cp{font-size:12px;color:#aaa;margin-top:2px}
.cd{font-size:12px;font-weight:700;margin-top:3px}
.dim{position:absolute;inset:0;background:rgba(0,0,0,.55)}
.menu{position:absolute;top:118px;right:16px;width:220px;background:#1e1e1e;border:1px solid #333;border-radius:14px;padding:6px 0;box-shadow:0 12px 30px rgba(0,0,0,.6)}
.mi{padding:12px 16px;font-size:15px}
.mi+.mi{border-top:1px solid #333}
.sheet{position:absolute;left:0;right:0;bottom:0;height:520px;background:#141414;border-radius:24px 24px 0 0;border-top:1px solid #333;padding:10px 18px}
.grab{width:40px;height:5px;border-radius:3px;background:#555;margin:0 auto 14px}
.n{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #262626}
.dot{width:9px;height:9px;border-radius:50%;background:#ff2d2d;margin-top:6px;flex:none}
.dot.r{background:transparent}
.nt{font-size:15px;font-weight:700}.nb{font-size:13px;color:#bbb;margin-top:3px}.nd{font-size:11px;color:#777;margin-top:4px}
.lg{padding:0 34px}
.inp{height:46px;border-radius:23px;background:#f2f6ff;color:#111;font-size:15px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;margin-top:14px}
.btn{height:46px;border-radius:23px;border:1.5px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;margin-top:26px}
.err{color:#ff6b6b;font-size:13px;margin-top:10px;text-align:center}
"""
BELL='<svg class="bell" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>'
def header(badge="2"):
    b=f'<div class="badge">{badge}</div>' if badge else ''
    return f'<div class="hd"><div class="logo">Learnn</div><div class="ic"><div style="position:relative">{BELL}{b}</div><div class="av" style="background-image:url({PH})"></div></div></div>'
def card(t,p,d,tag=None,ep=None):
    tg=f'<div class="tag">{tag}</div>' if tag else ''
    e=f'<div class="ep">{ep}</div>' if ep else ''
    return f'<div class="card"><div class="cov">{tg}{e}</div><div class="ct">{t}</div><div class="cp">{p}</div><div class="cd">{d}</div></div>'
def home():
    r1=card("Funnel discovery","Luca Mastella - Designer","1h 20min","WEBINAR","16")+card("Funnel discovery","Luca Mastella - Designer","1h 20min","CORSO","12")+card("Funnel","Luca","1h","WEBINAR","8")
    r2=card("Funnel discovery","Luca Mastella - Designer","24min")+card("Funnel discovery","Luca Mastella - Designer","18min")+card("Funnel","Luca","1h")
    return header()+f'<div class="sec"><div class="st">Corsi e webinar</div><div class="row">{r1}</div></div><div class="sec"><div class="st">Growth Hacking</div><div class="row">{r2}</div></div>'
SB='<div class="isl"></div><div class="sb"><span>9:41</span><span>●●● ▮</span></div>'
screens={
"login": SB+'<div class="lg" style="margin-top:190px"><div style="font-size:30px;font-weight:700;text-align:center;margin-bottom:30px">Benvenuto</div><div class="inp">gianluca@learnn.com</div><div class="inp"><span style="color:#888">Password</span><span>👁</span></div><div class="err">Email o password non corrette</div><div class="btn">Accedi</div></div>',
"home": SB+home(),
"avatar": SB+home()+'<div class="dim"></div><div class="menu"><div class="mi" style="font-weight:700">Gianluca Carucci</div><div class="mi">Logout</div></div>',
"notifiche": SB+home().replace('<div class="badge">2</div>','')+'<div class="dim"></div><div class="sheet"><div class="grab"></div><div style="font-size:20px;font-weight:700;margin-bottom:6px">Notifiche</div>'
 +'<div class="n"><div class="dot"></div><div><div class="nt">Nuovo webinar</div><div class="nb">Funnel discovery con Luca Mastella</div><div class="nd">2 ore fa</div></div></div>'
 +'<div class="n"><div class="dot"></div><div><div class="nt">Nuove puntate</div><div class="nb">Funnel discovery: 4 nuove puntate</div><div class="nd">5 ore fa</div></div></div>'
 +'<div class="n"><div class="dot r"></div><div><div class="nt">Benvenuto in Learnn</div><div class="nb">Inizia dal catalogo Growth Hacking</div><div class="nd">ieri</div></div></div></div>',
}
for k,body in screens.items():
    f=OUT/f"{k}.html"
    f.write_text(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS.replace("%PH%",PH)}</style></head><body><div class="phone"><div class="scr">{body}</div></div></body></html>')
    subprocess.run([CHROME,"--headless=new","--disable-gpu","--hide-scrollbars","--allow-file-access-from-files","--window-size=430,884","--force-device-scale-factor=3","--virtual-time-budget=3000",f"--screenshot={OUT/(k+'.png')}",f.as_uri()],check=True,capture_output=True)
    print(k)

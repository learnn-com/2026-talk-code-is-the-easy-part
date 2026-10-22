import subprocess, sys, pathlib
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
D=pathlib.Path(sys.argv[1]); OUT=pathlib.Path(sys.argv[2])
PH=(D/"photo.png").as_uri()
BELL='<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>'
AV=f'<div style="width:38px;height:38px;border-radius:50%;background:url({PH}) center/cover;border:1.5px solid #fff"></div>'
BELLB=f'<div style="position:relative">{BELL}<div style="position:absolute;top:-4px;right:-6px;background:#ff2d2d;color:#fff;font-size:11px;font-weight:700;border-radius:10px;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center">2</div></div>'
def row(lab,icons):
    return f'<div style="margin-bottom:22px"><div style="font-size:17px;color:#555;margin-bottom:8px"><b style="color:#000">{lab[0]}</b> · {lab[1]}</div><div style="background:#000;border-radius:14px;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 22px"><div style="color:#fff;font-size:30px;font-weight:700">Learnn</div><div style="display:flex;gap:18px;align-items:center">{icons}</div></div></div>'
html=f'<!doctype html><html><head><meta charset="utf-8"><style>*{{margin:0;padding:0;box-sizing:border-box}}body{{background:#fff;width:600px;height:372px;padding:4px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif}}</style></head><body>'+row(("01-01-001","Login: header con solo il logo"),"")+row(("01-01-002","Avatar: + menu e logout"),AV)+row(("01-03-001","Campanella: + notifiche"),BELLB+AV)+'</body></html>'
f=OUT/"header-storie.html"; f.write_text(html)
subprocess.run([CHROME,"--headless=new","--disable-gpu","--hide-scrollbars","--allow-file-access-from-files","--window-size=600,372","--force-device-scale-factor=2",f"--screenshot={OUT/'header-storie.png'}",f.as_uri()],check=True,capture_output=True)

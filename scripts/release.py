"""Deterministic RC archive + SHA-256 manifest; verify rejects any stale file."""
import sys,json,hashlib,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
items={'optical-packaging-master-v0.4.html':'dist/optical-packaging-master-v0.4.html','README.md':'README.md','PHYSICS_MODEL.md':'docs/PHYSICS_MODEL.md','RELEASE_NOTES.md':'docs/RELEASE_NOTES.md','TEST_SUMMARY.md':'docs/TEST_SUMMARY.md','GAME_DESIGN.md':'docs/GAME_DESIGN.md','GAMEPLAY_AUDIT.md':'docs/GAMEPLAY_AUDIT.md'}
sha=lambda b:hashlib.sha256(b).hexdigest()
contents={name:(root/src).read_bytes() for name,src in items.items()}
hashes={name:sha(b) for name,b in contents.items()}
archive=root/'dist/optical-packaging-master-v0.4-release.zip'
manifest_path=root/'dist/release-manifest.json'
if '--verify' in sys.argv:
 m=json.loads(manifest_path.read_text())
 assert m['version']=='0.4.0' and m['status']=='Release Candidate'
 assert m['zip']['sha256']==sha(archive.read_bytes())
 assert m['files']==hashes
 with zipfile.ZipFile(archive) as z:
  assert z.testzip() is None
  assert set(z.namelist())==set(contents)|{'SHA256SUMS.txt'}
  for name,data in contents.items():assert z.read(name)==data,name+' stale'
  assert z.read('SHA256SUMS.txt').decode()==''.join(f'{h}  {name}\n' for name,h in hashes.items())
 assert m['html']['sha256']==hashes['optical-packaging-master-v0.4.html']
 print('PASS: release manifest, ZIP integrity, all source bytes and SHA256SUMS')
else:
 contents['SHA256SUMS.txt']=''.join(f'{h}  {name}\n' for name,h in hashes.items()).encode()
 with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for name,data in contents.items():
   info=zipfile.ZipInfo(name,(2026,10,11,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,data)
 manifest={'version':'0.4.0','status':'Release Candidate','baseline':'e66573f81fbda98352f30f121c0ddef549ec2544','files':hashes,'html':{'path':'dist/optical-packaging-master-v0.4.html','sha256':hashes['optical-packaging-master-v0.4.html']},'zip':{'path':str(archive.relative_to(root)),'sha256':sha(archive.read_bytes())}}
 manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
 print(f'RC ZIP: {archive.name} ({archive.stat().st_size} bytes)')

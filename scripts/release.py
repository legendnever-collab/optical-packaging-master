"""Deterministic v0.7 release package; prior v0.1–v0.6 artifacts and manifest stay intact."""
import sys,json,hashlib,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
version='0.7.0'
items={}
for name in ['optical-packaging-master-v0.7.html','optical-packaging-master-v0.7-vertical-slice.html','optical-packaging-master-v0.7-chapters-1-4-preview.html']:items[name]='dist/'+name
for name in ['GAME_DESIGN.md','PHYSICS_MODEL.md','USER_JOURNEY.md','MODEL_LIMITATIONS.md','MIGRATION.md','TEST_SUMMARY.md','GAMEPLAY_AUDIT.md','RELEASE_NOTES.md','ASSEMBLY_CHALLENGE.md','PHYSICAL_SCENE_ARCHITECTURE.md','browser-qa-results.json','campaign-qa-results.json']:items[name]='docs/'+name
for name in ['README.md','CLAUDE.md','index.html','package.json','package-lock.json']:items['source/'+name]=name
for folder in ['src','tests','scripts','.github']:
 for path in sorted((root/folder).rglob('*')):
  if path.is_file():items['source/'+str(path.relative_to(root))]=str(path.relative_to(root))
for path in sorted((root/'docs/screenshots').glob('v0.7-*.png')):items['screenshots/'+path.name]=str(path.relative_to(root))
sha=lambda b:hashlib.sha256(b).hexdigest()
contents={name:(root/src).read_bytes() for name,src in items.items()}
hashes={name:sha(b) for name,b in contents.items()}
archive=root/'dist/optical-packaging-master-v0.7-release.zip'
manifest_path=root/'dist/release-manifest-v0.7.json'
if '--verify' in sys.argv:
 m=json.loads(manifest_path.read_text());assert m['version']==version and m['status']=='Release'
 assert m['zip']['sha256']==sha(archive.read_bytes());assert m['files']==hashes
 with zipfile.ZipFile(archive) as z:
  assert z.testzip() is None;assert set(z.namelist())==set(contents)|{'SHA256SUMS.txt'}
  for name,data in contents.items():assert z.read(name)==data,name+' stale'
  assert z.read('SHA256SUMS.txt').decode()==''.join(f'{h}  {name}\n' for name,h in hashes.items())
 assert m['html']['sha256']==hashes['optical-packaging-master-v0.7.html']
 print('PASS: v0.7 release manifest, ZIP CRC, modular source and SHA256SUMS')
else:
 contents['SHA256SUMS.txt']=''.join(f'{h}  {name}\n' for name,h in hashes.items()).encode()
 with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for name,data in contents.items():
   info=zipfile.ZipInfo(name,(2026,10,11,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,data)
 manifest={'version':version,'status':'Release','baseline':'2d52ce76d8a53a089af7756e8404f8272f099728','dependency':'v0.6 PR #6 merged at 2ceb71e94f867f76905eaa57a4a762d684f9983a','files':hashes,'html':{'path':'dist/optical-packaging-master-v0.7.html','sha256':hashes['optical-packaging-master-v0.7.html']},'zip':{'path':str(archive.relative_to(root)),'sha256':sha(archive.read_bytes())}}
 manifest_path.write_text(json.dumps(manifest,indent=2)+'\n');print(f'Release ZIP: {archive.name} ({archive.stat().st_size} bytes; {len(items)} files)')

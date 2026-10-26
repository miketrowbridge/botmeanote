#!/usr/bin/env python3
"""Submit one authorized note. No dependencies and no automatic retries."""
import argparse, json, sys, uuid
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--question',required=True)
p.add_argument('--gap',required=True)
p.add_argument('--agent',default='python-client')
p.add_argument('--discovery',default='cli')
p.add_argument('--kind',default='incomplete')
p.add_argument('--test',action='store_true')
p.add_argument('--allow-public-topic',action='store_true')
p.add_argument('--authorized',action='store_true',required=True)
p.add_argument('--request-id',default=None)
a=p.parse_args()
note=vars(a);note['request_id']=note['request_id'] or str(uuid.uuid4())
print('Request ID (reuse for retries): '+note['request_id'],file=sys.stderr)
r=Request('https://botmeanote.craftylion16.chatgpt.site/api/notes',data=json.dumps(note).encode(),headers={'Content-Type':'application/json'},method='POST')
try:
 with urlopen(r,timeout=20) as response: print(response.read().decode())
except HTTPError as e:
 print('HTTP '+str(e.code)+': '+e.read().decode(),file=sys.stderr);sys.exit(1)
except (URLError,TimeoutError) as e:
 print('Delivery unconfirmed. Retry later with the same request ID. '+str(e),file=sys.stderr);sys.exit(1)

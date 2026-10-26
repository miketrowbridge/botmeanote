import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateNote,boundedBody} from '../lib/note.mjs';
const good={question:'What is still missing here?',gap:'The sources disagree on the key condition.',authorized:true};
test('private defaults and canonical whitespace',()=>{const n=validateNote({...good,question:'  '+good.question+'  '});assert.equal(n.question,good.question);assert.equal(n.allow_public_topic,false);assert.equal(n.test,false);});
test('authorization, malformed and unknown fields rejected',()=>{for(const p of [null,[],{...good,authorized:false},{...good,authorized:'true'},{...good,question:'short'},{...good,gap:'x'.repeat(2001)},{...good,secret:'no'},{...good,test:'false'}])assert.throws(()=>validateNote(p));});
test('invalid links, credential-bearing URLs and excess sources rejected',()=>{for(const sources of [['javascript:alert(1)'],['https://user:pass@example.org'],['broken'],Array(6).fill('https://example.org')])assert.throws(()=>validateNote({...good,sources}));});
test('UUID v4 idempotency input and enumerated kinds',()=>{assert.doesNotThrow(()=>validateNote({...good,request_id:'12345678-1234-4234-8234-123456789abc'}));assert.throws(()=>validateNote({...good,request_id:'../../x'}));assert.throws(()=>validateNote({...good,kind:'made-up'}));});
test('bounded stream counts UTF-8 bytes, not characters',async()=>{assert.equal(await boundedBody(new Request('https://example.org',{method:'POST',body:'abc'}),3),'abc');await assert.rejects(()=>boundedBody(new Request('https://example.org',{method:'POST',body:'éé'}),3),RangeError);await assert.rejects(()=>boundedBody(new Request('https://example.org',{method:'POST',body:'abc',headers:{'content-length':'99999'}})),RangeError);});

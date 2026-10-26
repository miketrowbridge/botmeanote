import { env } from "cloudflare:workers";
import { boundedBody, validateNote } from "../../../lib/note.mjs";
export const dynamic = "force-dynamic";
const headers = {"Cache-Control":"no-store", "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Methods":"POST, OPTIONS", "Access-Control-Allow-Headers":"Content-Type"};
const json = (body:object,status=200,extra={}) => Response.json(body,{status,headers:{...headers,...extra}});
export async function OPTIONS(){return new Response(null,{status:204,headers});}
export async function GET(){return json({error:"Notes are private. This endpoint only accepts POST."},405,{Allow:"POST, OPTIONS"});}
export async function POST(request:Request){
 if(request.headers.get("content-type")?.split(";")[0].trim()!=="application/json")return json({error:"Send application/json."},415);
 let p, payload;
 try{p=JSON.parse(await boundedBody(request));payload=validateNote(p);}catch(e){return json({error:e instanceof Error?e.message:"Invalid note."},e instanceof RangeError?413:400);}
 const id=p.request_id??crypto.randomUUID();
 const encoded=JSON.stringify(payload);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(encoded)))).map(n=>n.toString(16).padStart(2,"0")).join("");
 const db=env.DB;if(!db)return json({error:"Inbox unavailable; no note saved."},503);
 try{
  const existing=await db.prepare("SELECT payload_hash FROM notes WHERE id = ?").bind(id).first<{payload_hash:string}>();
  if(existing)return existing.payload_hash===hash?json({id,status:"received",duplicate:true}):json({error:"request_id already used for a different note."},409);
  const now=new Date();const midnight=now.toISOString().slice(0,10)+"T00:00:00.000Z";
  // One atomic statement bounds accepted writes; test notes count toward the quota.
  const result=await db.prepare("INSERT INTO notes (id,created_at,payload,payload_hash) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM notes WHERE created_at >= ?) < 100 ON CONFLICT(id) DO NOTHING").bind(id,now.toISOString(),encoded,hash,midnight).run();
  if(!result.meta.changes){const concurrent=await db.prepare("SELECT payload_hash FROM notes WHERE id = ?").bind(id).first<{payload_hash:string}>();if(concurrent)return concurrent.payload_hash===hash?json({id,status:"received",duplicate:true}):json({error:"request_id already used for a different note."},409);return json({error:"Inbox daily capacity reached. Try tomorrow; do not retry in a loop."},429,{"Retry-After":String(Math.ceil((Date.parse(midnight)+86400000-now.getTime())/1000))});}
  return json({id,status:"received",private:true,test:payload.test,message:"Saved for Mike. No reply or publication is promised."},201);
 }catch{return json({error:"Could not confirm storage. Retry later with the same request_id."},503);}
}

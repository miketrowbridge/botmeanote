export const kinds = ["missing", "incomplete", "conflicting", "outdated", "uncertain", "human-perspective", "other"];
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validateNote(p) {
 if (!p || typeof p !== "object" || Array.isArray(p)) throw new Error("Expected a JSON object.");
 const allowed = ["question","gap","kind","sources","agent","discovery","test","authorized","allow_public_topic","request_id"];
 if (Object.keys(p).some(k => !allowed.includes(k))) throw new Error("Unknown field. See /openapi.json.");
 if(p.authorized !== true) throw new Error("Set authorized to true only when you may share this note.");
 for(const k of ["question", "gap"]) if(typeof p[k] !== "string" || p[k].trim().length < 10 || p[k].length > 2000) throw new Error(k + " must be 10–2000 characters.");
 if(p.kind !== undefined && !kinds.includes(p.kind)) throw new Error("Unknown kind.");
 for(const k of ["agent", "discovery"]) if(p[k] !== undefined && (typeof p[k] !== "string" || p[k].length > 120)) throw new Error(k + " must be at most 120 characters.");
 for(const k of ["test", "allow_public_topic"]) if(p[k] !== undefined && typeof p[k] !== "boolean") throw new Error(k + " must be boolean.");
 if(p.request_id !== undefined && (typeof p.request_id !== "string" || !UUID.test(p.request_id))) throw new Error("request_id must be a UUID v4.");
 if(p.sources !== undefined && (!Array.isArray(p.sources) || p.sources.length > 5)) throw new Error("Use at most five source URLs.");
 const sources = p.sources ?? [];
 for(const s of sources) {if(typeof s !== "string" || s.length > 500) throw new Error("Source URLs must be at most 500 characters."); let u; try {u = new URL(s);} catch {throw new Error("Invalid source URL.");} if(!["http:","https:"].includes(u.protocol) || u.username || u.password) throw new Error("Sources must be HTTP(S) URLs without credentials.");}
 return {question:p.question.trim(), gap:p.gap.trim(), kind:p.kind??"incomplete", sources, agent:(p.agent??"").trim(), discovery:(p.discovery??"").trim(), test:p.test??false, authorized:true, allow_public_topic:p.allow_public_topic??false};
}
export async function boundedBody(request, limit=16384) {
 if(Number(request.headers.get("content-length")) > limit) throw new RangeError("Maximum request size is 16 KiB.");
 const reader=request.body?.getReader(); if(!reader) throw new Error("Missing request body.");
 const chunks=[];let size=0;
 while(true){ const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new RangeError("Maximum request size is 16 KiB.");}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.byteLength;}return new TextDecoder().decode(bytes);
}

import OpenAI from "openai";
export const runtime="nodejs";
function auth(req:Request){const k=process.env.SEORAAI_API_KEY;if(!k)return true;const h=req.headers.get("authorization")||"";return h===`Bearer ${k}`||h===""}
export async function POST(req:Request){
 const started=Date.now(); if(!auth(req))return Response.json({error:{message:"Invalid API key"}},{status:401});
 const body=await req.json(); const key=process.env.OPENAI_API_KEY;
 if(!key)return Response.json({error:{message:"OPENAI_API_KEY is missing. Local UI is ready; add a real provider key to enable generation."}},{status:503});
 const client=new OpenAI({apiKey:key}); const stream=await client.responses.create({model:process.env.OPENAI_TEXT_MODEL||"chat-latest",input:body.messages?.map((m:any)=>({role:m.role,content:m.content}))||body.input,stream:true});
 const enc=new TextEncoder(); let closed=false;
 const rs=new ReadableStream({async start(c){try{
   for await(const e of stream as any){if(e.type==="response.output_text.delta"){c.enqueue(enc.encode(`data: ${JSON.stringify({choices:[{delta:{content:e.delta}}]})}\n\n`))}}
   c.enqueue(enc.encode("data: [DONE]\n\n")); closed=true;c.close();
 }catch(err:any){c.enqueue(enc.encode(`event: error\ndata: ${JSON.stringify({message:err.message})}\n\n`));c.close()}
 finally{console.info("SeoraAI latency",{route:"/v1/chat/completions",ms:Date.now()-started,ok:closed})}}});
 return new Response(rs,{headers:{"Content-Type":"text/event-stream","Cache-Control":"no-cache, no-transform","Connection":"keep-alive"}});
}

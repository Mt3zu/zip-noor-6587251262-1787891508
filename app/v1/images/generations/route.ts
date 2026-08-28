import OpenAI from "openai";
export async function POST(req:Request){
 const started=Date.now(); const body=await req.json();
 if(!process.env.OPENAI_API_KEY)return Response.json({error:{message:"Configure OPENAI_API_KEY to enable real image generation."}},{status:503});
 try{const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});const r=await client.images.generate({model:process.env.OPENAI_IMAGE_MODEL||"gpt-image-2",prompt:body.prompt,size:body.size||"1024x1024"} as any);return Response.json({created:Date.now(),data:r.data})}
 catch(e:any){return Response.json({error:{message:e.message}},{status:500})}
 finally{console.info("SeoraAI latency",{route:"/v1/images/generations",ms:Date.now()-started})}
}

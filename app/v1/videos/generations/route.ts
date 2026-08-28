import {NextResponse} from "next/server";
export async function POST(req:Request){
 const started=Date.now(); const body=await req.json(); const seconds=Math.max(5,Math.min(20,Number(body.seconds)||8));
 console.info("SeoraAI latency",{route:"/v1/videos/generations",ms:Date.now()-started});
 return NextResponse.json({id:"video_"+crypto.randomUUID(),object:"video_job",status:"provider_required",seconds,prompt:body.prompt,message:"Video adapter is ready, but a real video provider must be configured. Do not expose provider keys to the browser."},{status:202});
}

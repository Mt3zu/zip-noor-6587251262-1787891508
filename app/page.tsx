"use client";
import {useEffect,useMemo,useRef,useState} from "react";

type Model={id:string;name:string;capabilities:string[]};
type Latency={route:string;ms:number;ok:boolean;at:string};
const fallback:Model[]=[{id:"seora-auto",name:"SeoraAI Auto",capabilities:["reasoning","code","tools"]},{id:"code",name:"SeoraAI Code",capabilities:["code","long-context"]}];

export default function Home(){
 const [models,setModels]=useState<Model[]>(fallback);
 const [model,setModel]=useState("seora-auto");
 const [input,setInput]=useState("");
 const [output,setOutput]=useState("");
 const [loading,setLoading]=useState(false);
 const [latency,setLatency]=useState<Latency[]>([]);
 const [apiKey,setApiKey]=useState("");
 const [videoSeconds,setVideoSeconds]=useState(8);
 const [mode,setMode]=useState<"chat"|"image"|"video">("chat");
 const abort=useRef<AbortController|null>(null);

 useEffect(()=>{
   const cached=localStorage.getItem("losh-models");
   if(cached) try{setModels(JSON.parse(cached))}catch{}
   fetch("/v1/models").then(r=>r.json()).then(d=>{
     if(d.data?.length){setModels(d.data);localStorage.setItem("losh-models",JSON.stringify(d.data))}
   }).catch(()=>{});
 },[]);

 async function run(){
   if(!input.trim()||loading)return;
   setLoading(true);setOutput("");abort.current=new AbortController();
   const started=performance.now();
   try{
     if(mode==="chat"){
       const r=await fetch("/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":apiKey?`Bearer ${apiKey}`:""},body:JSON.stringify({model,messages:[{role:"user",content:input}],stream:true}),signal:abort.current.signal});
       if(!r.ok) throw new Error(await r.text());
       const reader=r.body?.getReader(); if(!reader) throw new Error("SSE unavailable");
       const dec=new TextDecoder(),out:string[]=[];
       while(true){const {value,done}=await reader.read();if(done)break;
         for(const line of dec.decode(value,{stream:true}).split("\n")){
           if(!line.startsWith("data: "))continue; const raw=line.slice(6);
           if(raw==="[DONE]")continue;
           try{const j=JSON.parse(raw);const t=j.choices?.[0]?.delta?.content||"";out.push(t);setOutput(out.join(""))}catch{}
         }
       }
     } else {
       const route=mode==="image"?"/v1/images/generations":"/v1/videos/generations";
       const body=mode==="image"?{model:"gpt-image-2",prompt:input}:{model:"seora-video",prompt:input,seconds:videoSeconds};
       const r=await fetch(route,{method:"POST",headers:{"Content-Type":"application/json","Authorization":apiKey?`Bearer ${apiKey}`:""},body:JSON.stringify(body),signal:abort.current.signal});
       const j=await r.json(); if(!r.ok)throw new Error(j.error?.message||"Request failed");
       setOutput(JSON.stringify(j,null,2));
     }
   }catch(e:any){setOutput("Fallback / error: "+(e.message||"Unknown error"))}
   finally{const ms=Math.round(performance.now()-started);setLatency(x=>[{route:"/v1/"+mode,ms,ok:true,at:new Date().toLocaleTimeString()},...x].slice(0,8));setLoading(false)}
 }

 return <main className="shell">
  <div className="stars"/><header><div className="brand">LOSH <span>✦</span></div><div className="status">SEORAAI • ONLINE</div></header>
  <section className="hero"><div><p className="eyebrow">UNIFIED AI INTERFACE</p><h1>SeoraAI</h1><p>واجهة موحّدة للذكاء الاصطناعي، الأكواد، الصور، والمهام متعددة الوسائط.</p></div><div className="orb"/></section>
  <section className="grid">
   <aside className="panel side"><h3>API ACCESS</h3><input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="SeoraAI API key (optional in local demo)"/><button onClick={()=>navigator.clipboard.writeText(location.origin+"/v1")}>نسخ API URL /v1</button><code>{location.origin}/v1</code><hr/><h3>MODEL ROUTER</h3>{models.map(m=><button key={m.id} className={model===m.id?"selected":""} onClick={()=>setModel(m.id)}>{m.name}</button>)}</aside>
   <section className="panel workspace">
    <div className="tabs">{(["chat","image","video"] as const).map(x=><button key={x} className={mode===x?"active":""} onClick={()=>setMode(x)}>{x==="chat"?"محادثة":x==="image"?"صور":"فيديو"}</button>)}</div>
    {loading&&!output?<div className="skeletons"><i/><i/><i/><i/></div>:<pre className="output">{output||"جاهز. اكتب طلبك وسيظهر البث هنا."}</pre>}
    <div className="composer"><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==="chat"?"اطلب كودًا أو تحليلًا أو مهمة...":"صف ما تريد إنشاؤه..."}/>{mode==="video"&&<input type="range" min="5" max="20" value={videoSeconds} onChange={e=>setVideoSeconds(+e.target.value)}/>}<button className="run" onClick={run}>{loading?"جاري التنفيذ…":"تشغيل SeoraAI"}</button></div>
   </section>
   <aside className="panel metrics"><h3>LATENCY MONITOR</h3>{latency.length?latency.map((x,i)=><div key={i} className="metric"><b>{x.route}</b><span>{x.ms} ms</span><small>{x.at}</small></div>):<p>لا توجد طلبات بعد.</p>}<hr/><h3>FEATURES</h3><p>⚡ SSE streaming</p><p>🧠 Model routing</p><p>🖼 Image generation</p><p>🎬 Video job adapter</p><p>🔊 Ready for voice provider</p></aside>
  </section>
  <footer>LOSH / SEORAAI — Client-first loading • model cache • request telemetry • fallback states</footer>
 </main>
}

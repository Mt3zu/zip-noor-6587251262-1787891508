import {NextResponse} from "next/server";
export const revalidate=60;
export async function GET(){
 return NextResponse.json({object:"list",data:[
  {id:"seora-auto",name:"SeoraAI Auto",object:"model",capabilities:["reasoning","code","tools"]},
  {id:"code",name:"SeoraAI Code",object:"model",capabilities:["code","long-context"]},
  {id:"image",name:"SeoraAI Image",object:"model",capabilities:["image"]}
 ]},{headers:{"Cache-Control":"public, s-maxage=60, stale-while-revalidate=300"}});
}

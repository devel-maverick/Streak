import axios from "axios";
const JUDGE0_URL = process.env.JUDGE0_API_URL;

const Language_Map={
  c: 50,  
  cpp: 54,     
  java: 62,    
  python3: 71, 
  pypy3: 73,   
  javascript: 63,  
  typescript: 74, 
  go: 60,          
  rust: 73   
}


export const getSupportedLanguages=()=>{
  return Object.keys(Language_Map)
}



export const submitCode=async({code,language,input})=>{
    const languageId=Language_Map[language]
    if(!languageId){
        throw new Error("Invalid language")
    }
    const {data}=await axios.post(`${JUDGE0_URL}/submissions`,{
      source_code: Buffer.from(code).toString("base64"),
      language_id: languageId,
      stdin: input ? Buffer.from(input).toString("base64") : null,
    },{
        headers:{
            "Content-Type":"application/json"
        }
    })
    return {token:data.token}
}


export const getSubmissionResult=async(token)=>{
    const {data}=await axios.get(`${JUDGE0_URL}/submissions/${token}`,{
        headers:{
            "Content-Type":"application/json"
        },
        params:{
            fields:"stdout,stderr,exit_code,time,memory,status"
        }
    })
    return {
    status: data.status?.name || "Unknown",
    statusId: data.status?.id,
    stdout: data.stdout ? Buffer.from(data.stdout, "base64").toString() : null,
    stderr: data.stderr ? Buffer.from(data.stderr, "base64").toString() : null,
    exitCode: data.exit_code,
    time: data.time,
    memory: data.memory, 
    }
}

const POLL_INTERVAL_MS = 1000;
const MAX_POLLS = 30; 
export const run=async({code,language,input})=>{
    const {token}=await submitCode({code,language,input})
    for(let i=0;i<MAX_POLLS;i++){
        const result=await getSubmissionResult(token)
        if(result.statusId!==2 && result.statusId!==1){
            return {token,...result}
        }
        await new Promise((resolve)=>setTimeout(resolve,POLL_INTERVAL_MS))
    }

    return {
        token,
        status: "Time Limit Exceeded (polling timeout)",
        statusId: -1,
        stdout: null,
        stderr: "Polling timed out after 30 seconds.",
        exitCode: null,
        time: null,
        memory: null,
    }
}
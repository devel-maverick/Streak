import { validateRequiredFields,isValidLanguage } from "../utils/validator.js";
import {runCode} from "../services/judge0.service.js";

export const run=async(req,res)=>{
    try{
        const {code,language,input}=req.body
        const missing=validateRequiredFields(["code","language"],req.body)
        if(missing.length>0){
            return res.status(400).json({message:`Missing required fields: ${missing.join(", ")}`})
        }
        if(!isValidLanguage(language)){
            return res.status(400).json({message:"Invalid language"})
        }
        if(code.trim().length===0){
            return res.status(400).json({message:"Code cannot be empty"})
        }
        const result=await runCode({code,language,input:input || ""})
        return res.status(200).json(result)



    }catch(err){
        console.log(err)
        res.status(500).json({message:"Code execution failed"})
    }
}



export const save=async(req,res)=>{
    try{
        const {problemId,language,code,input,output}=req.body
        if(!language || !code){
            return res.status(400).json({message:"Language and code are required"})
        }
        const existDraft=await prisma.codeDraft.findFirst({
            where:{
                userId:req.user.id,
                problemId
            }
        })
        let draft;
        if(existDraft){
            draft=await prisma.codeDraft.update({
                where:{
                    id:existDraft.id
                },
                data:{
                    code,
                    input:input || "",
                    output:output || "",
                    language
                }
            })
        }else{
            draft=await prisma.codeDraft.create({
                data:{
                    userId:req.user.id,
                    problemId:problemId || null,
                    code,
                    input:input || "",
                    output:output || "",
                    language
                }
            })
        }
        return res.status(200).json({message:"Code saved successfully",draftId:draft.id})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Code saving failed"})
    }
}



export const getDraft=async(req,res)=>{
    try{
        const {problemId}=req.params
        const draft=await prisma.codeDraft.findFirst({
            where:{
                userId:req.user.id,
                problemId
            }
        })
        if(!draft){
            return res.status(200).json({
                code:"",
                problemId,
                language:"python",
                input:"",
                output:""
            })
        }
        return res.status(200).json(draft)

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Code fetching failed"})
    }
}
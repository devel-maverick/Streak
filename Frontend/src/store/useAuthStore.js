import { create } from "zustand";
import axiosInstance from "../../api/axios";

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoading:false,
    setUser: (user) => set({ user }),


    login:async()=>{
        const user=get().user
        set({isLoading:true})
        try {
            const response=await axiosInstance.post("/auth/login",{
                email:user.email,
                password:user.password
            })
            set({user:response.data,isLoading:false})
        } catch (error) {
            console.log(error)
            set({isLoading:false})
        }
    },
    register:async()=>{
        const user=get().user
        set({isLoading:true})
        try {
            const response=await axiosInstance.post("/auth/register",{
                name:user.name,
                email:user.email,
                password:user.password
            })
            set({user:response.data,isLoading:false})
        } catch (error) {
            console.log(error)
            set({isLoading:false})
        }
    },
    logout:async()=>{
        try {
            const response=await axiosInstance.post("/auth/logout")
            set({user:null})
        } catch (error) {
            console.log(error)
        }
    }


}))
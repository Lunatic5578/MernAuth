
import {create} from "zustand";
import axios from "axios";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

const API_URI=import.meta.env.MODE==="development" ? "http://localhost:4000/api/auth" : "/api/auth";

axios.defaults.withCredentials=true

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticating: false,
    error: null,
    isLoading:false,
    isCheckingAuth:true,

    signup:async(email,password,name)=>{
        set({isLoading:true,error:null})
        try{
            const response=await axios.post(`${API_URI}/signup`,{email,password,name})
            set({user:response.data.user,isAuthenticated:true,isLoading:false})
        }
        catch(error){
            set({error:error.response.data.message || "Error signing up",isLoading:false})
            throw error
            
            
        }
    },

    verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URI}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},

    login:async(email,password)=>{
        set({isLoading:true,error:null})
        try{
            const response=await axios.post(`${API_URI}/login`,{email,password})
            set({user:response.data.user,error:null,isAuthenticated:true,isLoading:false})
        }
        catch(error){
            set({error:error.response?.data?.message || "Error logging in",isLoading:false})
            throw error
        }
    },

    logout:async()=>{
        set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URI}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
    },

    checkAuth:async()=>{
        set({isCheckingAuth:true,error:null})
        try{
            const response=await axios.get(`${API_URI}/check-auth`)
            set({user:response.data.user,isAuthenticated:true,isCheckingAuth:false})
        }
        catch(error){
            set({error:null,isCheckingAuth:false,isAuthenticated:false})
        }
    },

    forgotPassword:async(email)=>{
        set({isLoading:true,error:null})
        try{
            const response=await axios.post(`${API_URI}/forgot-password`,{email})
            set({isLoading:false,message:response.data.message})
        }
        catch(error){
            set({error:error.response.data.message || "Error sending email",isLoading:false})
            throw error
        }
    },
    
    resetPassword:async(password,token)=>{
        set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URI}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
    },
}));

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'

interface authItems  {
    token : string | null,
    isAuthenticated : boolean,
    username : string | null,
    role: string | null
}
const init : authItems= {
    isAuthenticated: typeof window !== 'undefined' && localStorage.getItem('token') ? true : false,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    username: null,
    role: ""
}

export const authSlice = createSlice({
    name : "auth", 
    initialState : init,
    reducers : {
        login : (state, action : PayloadAction<authItems>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.username = action.payload.username,
            state.role = action.payload.role
        }, 
        logout : (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.username = null;
            state.role = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
              }
        }
    
    }
})
export const { login, logout } = authSlice.actions

export default authSlice.reducer


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'

interface authItems  {
    token : string | null,
    isAuthenticated : boolean,
    username : string | null
}
const init : authItems= {
    isAuthenticated: typeof window !== 'undefined' && localStorage.getItem('token') ? true : false,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    username: null,
}

export const authSlice = createSlice({
    name : "auth", 
    initialState : init,
    reducers : {
        login : (state, action : PayloadAction<authItems>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.username = action.payload.username 
        }, 
        logout : (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.username = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                // localStorage.removeItem("username");
              }
        }
    
    }
})
export const { login, logout } = authSlice.actions

export default authSlice.reducer

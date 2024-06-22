import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//initail state
const initialState = {
    user: null,
    cartedItems: [],
    orderedItems: [],
    username: "",
    password: "",
    name: "",
    loading: false
}

// Authentcate the user 
export const authenticateUser = createAsyncThunk("auth/loginUser", async (args, ThunkAPI) => {
    const { auth, username, password, signInWithEmailAndPassword } = args;
    const data = await signInWithEmailAndPassword(auth, username, password);
    return data;
});

//Logging out the user froom the system
export const logout = createAsyncThunk("auth/logout", async (args, ThunkAPI) => {
    const { signOut, auth } = args;
    return await signOut(auth);
})

//Creating the new user
export const signUpAsync = createAsyncThunk("auth/signUp", async (args, ThunkAPI) => {
    const { createUserWithEmailAndPassword, auth, username, password, name, updateProfile, setDoc, doc, db } = args;
    const res = await createUserWithEmailAndPassword(auth, username, password);
    
    await updateProfile(auth.currentUser, {
        displayName: name,
      });

    await setDoc(doc(db, "auth", res.user.uid), {
        id: auth.currentUser.uid,
        orderedItems: [],
        cartedItems: []
        });
    return res;
})

//Slice of authReducer
const authSlice = createSlice({
    name: "auth", 
    initialState,
    reducers:{
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setUser: (state,action) => {
            state.user = action.payload;
        },
        setCartedItems : (state, action) => {
            state.cartedItems = action.payload;
        },
        setOrderedItems: (state, action) => {
            state.orderedItems = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authenticateUser.fulfilled,(state, action) => {
            state.user = action.payload.user.toJSON();
            state.username = "";
            state.password = "";
            state.loading = false;
        }).addCase(authenticateUser.rejected, (state, action) => {
            state.username = "";
            state.password = "";
            state.loading = false;
        }).addCase(logout.fulfilled, (state, action) => {
            state.user = null;
            state.cartedItems = [];
            state.orderedItems = [];
            state.loading =false;
        }).addCase(signUpAsync.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.name = "";
            state.username = "";
            state.password = "";
            state.loading = false;
        }).addCase(signUpAsync.rejected, (state, action) => {
            state.name = "";
            state.username = "";
            state.password = "";
            state.loading = false;
        }).addCase(authenticateUser.pending, (state, action) => {
            state.loading = true;
        }).addCase(signUpAsync.pending, (state, action) => {
            state.loading = true;
        }).addCase(logout.pending, (state, action) => {
            state.loading = true;
        })
    }

})

//Exporting the values
export const authReducer = authSlice.reducer;
export const authaction = authSlice.actions;
export const authSelector = (state) => state.authReducer;

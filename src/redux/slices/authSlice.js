import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BaseAPI from "../../util/BaseAPI";

const initialState = {
  userInfo: null,
  login: {
    loading: false,
    errorMessage: null
  },
  register: {
    loading: false,
    errorMessage: null,
    isRegisterByGoogle: false,
    emailRegister: null,
    role: null,
    campusId: null,
    registerSuccess: false
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setRoleAndCampus: (state, action) => {
      const payload = action.payload;
      state.register = {
        ...state.register,
        role: payload.role,
        campusId: payload.campusId
      };
    },
    logout: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.login.loading = true;
        state.login.errorMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { response, isLoginByGoogle } = action.payload;
        if (response?.response?.status === 400 && !isLoginByGoogle) {
          state.login.errorMessage = response.response.data.error_message;
        } else if (response?.response?.status === 400 && isLoginByGoogle) {
          //đăng kí bằng gmail
          state.login.errorMessage = null;
        } else if (response?.status === 200) {
          //đăng nhập thành công
          state.login.errorMessage = null;
        } else {
          state.login.errorMessage = response?.data?.error_message || "Thông tin chưa chính xác, vui lòng kiểm tra lại";
        }
        state.login.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.loading = false;
        state.login.errorMessage = "Có lỗi khi kết nối đến máy chủ";
      })
      .addCase(setCurrentUserInfo.fulfilled, (state, action) => {
        const res = action.payload;
        if (res?.status === 200) {
          state.userInfo = res.data.item;
        } else {
          authSlice.actions.logout();
        }
      })
      .addCase(setCurrentUserInfo.rejected, (state, action) => {
        authSlice.actions.logout();
      })
      .addCase(register.pending, (state, action) => {
        state.register = {
          ...state.register,
          loading: true,
          errorMessage: null,
          registerSuccess: false
        };
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.loading = false;
        const res = action.payload;
        if (res?.status === 201) {
          state.register.registerSuccess = true;
        } else {
          if (res?.response?.data?.message) {
            state.register.errorMessage = res.response.data.message;
          } else {
            state.register.errorMessage = "Có lỗi khi kết nối đến máy chủ";
          }
        }
      })
      .addCase(register.rejected, (state, action) => {
        const res = action.payload;
        state.register.loading = false;
        if (res?.response?.data?.message) {
          state.register.errorMessage = res.response.data.message;
        } else {
          state.register.errorMessage = "Có lỗi khi kết nối đến máy chủ";
        }
      });
  }
});

export default authSlice;
var HOST = null;
if (process.env.NODE_ENV === "development") {
  HOST = "127.0.0.1";
} else {
  HOST = "127.0.0.1";
}
// Đăng nhập
export const login = createAsyncThunk("auth/login", async (user, { getState, dispatch }) => {
  let isLoginByGoogle = false;
  let body = null;
  if (user.idToken) {
    isLoginByGoogle = true;
    body = {
      id_token: user.idToken
    };
  } else {
    body = {
      username: user.username,
      password: user.password
    };
  }
  try {
    //riêng login dùng axios chưa config
    console.log(`http://${HOST}:8010/v1/login`)
    const response = await axios.post(`http://${HOST}:8010/v1/login`, body);
    if (response?.status === 200) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      dispatch(setCurrentUserInfo());
    } else {
      if ((response?.status === 400 || response?.response.status === 400) && isLoginByGoogle) {
        //Mail chưa đki -> đki mới
        getState().auth = {
          ...getState().auth,
          register: {
            ...getState().auth.register,
            isRegisterByGoogle: true,
            emailRegister: user.email
          }
        };
      }
    }
    return { response: response, isLoginByGoogle };
  } catch (error) {
    if ((error?.status === 400 || error?.response.status === 400) && isLoginByGoogle) {
      //Mail chưa đki -> đki mới
      getState().auth = {
        ...getState().auth,
        register: {
          ...getState().auth.register,
          isRegisterByGoogle: true,
          emailRegister: user.email
        }
      };
    }
    return { response: error, isLoginByGoogle };
  }
});

/////
export const setCurrentUserInfo = createAsyncThunk("auth/getUser", async (param, { getState, dispatch }) => {
  try {
    const res = await BaseAPI.get("users/current");
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
});
// Đăng kí
export const register = createAsyncThunk("auth/register", async (user, { getState }) => {
  try {
    const res = await BaseAPI.post("register", {
      ...user,
      role: getState().auth.register.role,
      campus_id: getState().auth.register.campusId
    });

    return res;
  } catch (error) {
    return Promise.reject(error);
  }
});

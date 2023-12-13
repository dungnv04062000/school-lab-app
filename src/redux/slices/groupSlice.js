import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BaseAPI from "../../util/BaseAPI";
import MultipartAPI from "../../util/MultipartFormDataAPI";
import * as S3 from "../../util/S3Host";

const initialState = {
  createTemplate: {
    loading: false,
    templateLink: null,
    message: null,
    templateStatus: false
  },
  loading: false,
  message: null,
  messageType: null
};

const groupSlice = createSlice({
  name: "group",
  initialState: initialState,
  reducers: {
    resetState: (state) => Object.assign(state, initialState)
  },
  extraReducers: (builder) => {
    builder
      .addCase(random.pending, (state, action) => {
        state.loading = true;
        state.message = null;
        state.messageType = null;
      })
      .addCase(random.fulfilled, (state, action) => {
        const res = action.payload;
        if (res?.status === 201) {
          state.message = "Tạo nhóm thành công";
          state.messageType = "SUCCESS";
        } else {
          state.message = res?.response?.data?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại";
          state.messageType = "ERROR";
        }
        state.loading = false;
      })
      .addCase(random.rejected, (state, action) => {
        const res = action.payload;
        state.message = res?.response?.data?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại";
        state.messageType = "ERROR";
        state.loading = false;
      })
      .addCase(order.pending, (state, action) => {
        state.loading = true;
        state.message = null;
        state.messageType = null;
      })
      .addCase(order.fulfilled, (state, action) => {
        const res = action.payload;
        if (res?.status === 201) {
          state.message = "Tạo nhóm thành công";
          state.messageType = "SUCCESS";
        } else {
          state.message = res?.response?.data?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại";
          state.messageType = "ERROR";
        }
        state.loading = false;
      })
      .addCase(order.rejected, (state, action) => {
        const res = action.payload;
        state.message = res?.response?.data?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại";
        state.messageType = "ERROR";
        state.loading = false;
      })
      .addCase(createTemplate.pending, (state, action) => {
        state.createTemplate.loading = true;
        state.createTemplate.message = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        const res = action.payload;
        if (res?.status === 200) {
          state.createTemplate.message = "Đã tạo xong";
          state.createTemplate.templateLink = S3.HOST + res?.data.serviceMessage;
          state.createTemplate.templateStatus = true;
        } else {
          state.createTemplate.message = "Tạo thất bại";
          state.createTemplate.templateStatus = false;
        }
        state.createTemplate.loading = false;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.createTemplate.message = "Tạo thất bại";
        state.createTemplate.templateStatus = false;
        state.createTemplate.loading = false;
      })
      .addCase(template.pending, (state, action) => {
        state.loading = true;
        state.message = null;
        state.messageType = null;
      })
      .addCase(template.fulfilled, (state, action) => {
        const res = action.payload;
        if (res?.status === 201) {
          state.message = "Tạo nhóm thành công";
          state.messageType = "SUCCESS";
        } else {
          state.message = res?.response?.data?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại";
          state.messageType = "ERROR";
        }
        state.loading = false;
      })
      .addCase(template.rejected, (state, action) => {
        const res = action.payload;
        state.message = res?.response?.data?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại";
        state.messageType = "ERROR";
        state.loading = false;
      });
  }
});

export default groupSlice;

export const random = createAsyncThunk("group/random", async (body) => {
  try {
    let response = await BaseAPI.post(`/class-groups/random`, {
      class_id: body.classId,
      lesson_id: body.lessonId,
      number_of_group: body.numberOfGroup,
      is_override: body.override
    });
    return response;
  } catch (error) {
    return error;
  }
});

export const order = createAsyncThunk("group/order", async (body) => {
  try {
    let response = await BaseAPI.post(`/class-groups/order`, {
      class_id: body.classId,
      lesson_id: body.lessonId,
      number_of_group: body.numberOfGroup,
      is_override: body.override
    });
    return response;
  } catch (error) {
    return error;
  }
});

export const createTemplate = createAsyncThunk("group/createTemplate", async (body) => {
  try {
    let response = await BaseAPI.get(`/class-groups/template/${body.classId}`);
    return response;
  } catch (error) {
    return error;
  }
});

export const template = createAsyncThunk("group/template", async (body) => {
  try {
    const data = new FormData();
    data.append("file", body.file);
    let response = await BaseAPI.post(`/class-groups/template/${body.classId}/${body.lessonId}`, data);
    return response;
  } catch (error) {
    return error;
  }
});

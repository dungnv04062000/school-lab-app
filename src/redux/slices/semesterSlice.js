import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BaseAPI from "../../util/BaseAPI";

const initialState = {
  semesters: []
};

const semesterSlice = createSlice({
  name: "semesters",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSemesters.fulfilled, (state, action) => {
        const res = action.payload;
        if (res?.status === 200) {
          state.semesters = res.data.items;
        } else {
          state.semesters = [];
        }
      })
      .addCase(loadSemesters.rejected, (state, action) => {
        state.semesters = [];
      });
  }
});

export default semesterSlice;

export const loadSemesters = createAsyncThunk("semesters/load", async (campusId) => {
  try {
    let response = BaseAPI.get(`/semesters`, {
      params: {
        campus_id: campusId
      }
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
});

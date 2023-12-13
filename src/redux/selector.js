import { createSelector } from "@reduxjs/toolkit";

export const registerRoleSelector = (state) => state.auth.register.role;
export const registerCampusSelector = (state) => state.auth.register.campusId;

export const loginLoadingSelector = (state) => state.auth.login.loading;
export const loginErrorMessageSelector = (state) => state.auth.login.errorMessage;

export const userInfoSelector = (state) => state.auth.userInfo;

export const semestersSelector = (state) => state.semesters.semesters;

export const isRegisterByGoogleSelector = (state) => state.auth.register.isRegisterByGoogle;
export const emailRegisterSelector = (state) => state.auth.register.emailRegister;
export const registerErrorMessageSelector = (state) => state.auth.register.errorMessage;
export const registerLoadingSelector = (state) => state.auth.register.loading;
export const registerSuccessSelector = (state) => state.auth.register.registerSuccess;

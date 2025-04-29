export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const GET_STUDENTS_API = `${BACKEND_BASE_URL}/students`;
export const CREATE_STUDENT_API = `${BACKEND_BASE_URL}/create-student`;
export const DELETE_STUDENT_API = `${BACKEND_BASE_URL}/delete-student`;
export const UPDATE_STUDENT_API = `${BACKEND_BASE_URL}/update-student`;
export const GET_STUDENT_BY_ID_API = `${BACKEND_BASE_URL}/student`;

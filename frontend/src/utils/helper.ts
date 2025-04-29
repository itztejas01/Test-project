import {
  CREATE_STUDENT_API,
  DELETE_STUDENT_API,
  GET_STUDENT_BY_ID_API,
  GET_STUDENTS_API,
  UPDATE_STUDENT_API,
} from "./api";
import { PAGE_LIMIT } from "./constants";
import { additonalRequest, getRequest } from "./customApi";
import { TStudent } from "./schema";
export const getStudents = async (
  page: number = 1,
  limit: number = PAGE_LIMIT
) => {
  try {
    const response = await getRequest(
      GET_STUDENTS_API + `?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createStudent = async (data: TStudent) => {
  try {
    const response = await additonalRequest(CREATE_STUDENT_API, data);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateStudent = async (studentId: number, data: TStudent) => {
  try {
    const response = await additonalRequest(
      `${UPDATE_STUDENT_API}/${studentId}`,
      data,
      "PUT"
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteStudent = async (studentId: number) => {
  try {
    const response = await additonalRequest(
      `${DELETE_STUDENT_API}/${studentId}`,
      {},
      "DELETE"
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getStudentById = async (studentId: number) => {
  try {
    const response = await getRequest(`${GET_STUDENT_BY_ID_API}/${studentId}`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
export const calculateAge = (date?: number) => {
  if (!date || isNaN(date) || date === null) return 0;

  const today = new Date();
  const birthDate = new Date(date);
  const age = today.getFullYear() - birthDate.getFullYear();
  return age;
};

export const formatDate = (date?: number | string) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

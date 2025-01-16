import { INTERNAL_USERS_API } from "@/api";
import { TUser } from "@/app/scehma";

export const addUsers = async (user: TUser): Promise<TUser> => {
  try {
    const response = await fetch(INTERNAL_USERS_API, {
      method: "POST",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw response.json();
    }
    const response_data = (await response.json()) as TUser;
    return Promise.resolve(response_data);
  } catch (err) {
    const error = await err;
    return Promise.reject(error);
  }
};

export const updateUsers = async (user: TUser): Promise<TUser> => {
  try {
    const response = await fetch(INTERNAL_USERS_API + `?userId=${user.id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw response.json();
    }
    const response_data = (await response.json()) as TUser;
    return Promise.resolve(response_data);
  } catch (err) {
    const error = await err;

    return Promise.reject(error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(INTERNAL_USERS_API + `?userId=${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw response.json();
    }
    const response_data = (await response.json()) as TUser;
    return Promise.resolve(response_data);
  } catch (err) {
    const error = await err;

    return Promise.reject(error);
  }
};

import Image from "next/image";
// import { ChartUi } from "./chart";
// import { Multichart } from "./Multichart";
// import { cookies } from "next/headers";
// import { createClient } from "@/util/supabase/server";
import { CardContainer } from "./internalComponents";
import { apiRequest } from "@/actions";
import { USERS_API } from "@/api";
import { TUserlist } from "./scehma";

const usersList = async (): Promise<TUserlist> => {
  try {
    const response = await apiRequest({ url: USERS_API });
    if (!response.ok) {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        throw response.json();
      } else {
        throw response.text();
      }
    }

    const response_data = (await response.json()) as TUserlist;

    return Promise.resolve(response_data);
  } catch (err) {
    const error = await err;
    console.log(error);

    return Promise.reject(error);
  }
};

export default async function Home() {
  const list_of_users = await usersList()
    .then((res) => res)
    .catch((err) => []);
  return (
    <div>
      <main>
        <CardContainer users={list_of_users} />
      </main>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Developed by Tejas Chaplot
        </a>
      </footer> */}
    </div>
  );
}

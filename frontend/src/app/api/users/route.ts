import { apiRequest } from "@/actions";
import { USERS_API } from "@/api";
import { NextRequest } from "next/server";

export async function GET(req: Request) {
  return await apiRequest({ url: USERS_API });
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  return await apiRequest({
    url: USERS_API,
    method: "POST",
    body: JSON.stringify(body),
    additionalHeaders: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "";
  const body = await req.json();
  return await apiRequest({
    url: USERS_API + `/${userId}`,
    method: "PUT",
    body: JSON.stringify(body),
    additionalHeaders: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "";
  return await apiRequest({
    url: USERS_API + `/${userId}`,
    method: "DELETE",
  });
}

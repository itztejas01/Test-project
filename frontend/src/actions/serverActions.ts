"use server";

import { NextResponse } from "next/server";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
export async function apiRequest({
  url,
  body,
  method = "GET",
  additionalHeaders,
}: // cache,
{
  url: string;
  body?: any;
  method?: RequestMethod;
  additionalHeaders?: any;
  // cache?: RequestCache;
}) {
  // const header = headers();
  // const host_name = header.get("host") || "";

  const response = await fetch(url, {
    method,
    body,
    headers: {
      ...additionalHeaders,
    },
    cache: "no-cache",
  });

  const response_headers_content_type =
    response.headers.get("Content-Type") || "";
  // const response_headers = Object.fromEntries(response.headers.entries());

  if (response_headers_content_type?.includes("application/json")) {
    const response_data = await response.json();

    return NextResponse.json(response_data, {
      status: response.status,
      // headers: response_headers,
    });
  } else {
    const response_data = await response.text();

    return new NextResponse(response_data, {
      status: response.status,
      headers: {
        // ...response.headers,
        "content-disposition":
          response.headers.get("content-disposition") || "",
      },
    });
  }
}

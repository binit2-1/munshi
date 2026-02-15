import { authClient } from "@/lib/auth-client";

export const makeAuthenticatedRequest = async (url: string, body?: any) => {
  const cookies = authClient.getCookie(); 
  const headers = {
    "Cookie": cookies, 
    "Content-Type": "application/json",
  };
  const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}${url}`, { 
    headers,
    credentials: "omit",
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json();
  return data;
};
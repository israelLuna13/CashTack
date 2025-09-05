"use server";

import { ErrorSchema, SuccessSchema, TokenSchema } from "@/src/schemas";

type ActionStateType = {
  errors: string[];
  success: string;
};
export async function confirmAccount(
  token: string,
  prevSatate: ActionStateType
) {
  const confirmToken = TokenSchema.safeParse(token);
  if (!confirmToken.success) {
    return {
      errors: confirmToken.error.issues.map((issue) => issue.message),
      success: prevSatate.success,
    };
  }
  //req
  const url = `${process.env.API_URL}/auth/confirm-account`;

  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      token: confirmToken.data,
    }),
  });

  const json = await req.json();
//if there are issues
  if (!req.ok) {
    const { error } = ErrorSchema.parse(json);
    return {
      errors: [error],
      success: "",
    };
  }
  const success = SuccessSchema.parse(json);
  return {
    errors: [],
    success,
  };
}

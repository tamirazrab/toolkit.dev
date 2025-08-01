import { signIn } from "@/server/auth";
import { IS_DEVELOPMENT } from "@/lib/constants";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (!IS_DEVELOPMENT) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") ?? "/";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: false,
  });

  console.log(token);

  if (token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}

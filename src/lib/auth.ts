import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "snp_session";

export const USERS = [
  { email: "admin@service.cl", password: "1234", name: "Admin" },
];

const secret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ?? "dev-secret-snp-2026-change-in-prod"
  );

export async function createSession(email: string, name: string) {
  return new SignJWT({ email, name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret());
  return payload as { email: string; name: string };
}

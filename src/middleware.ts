import NextAuthMiddleware from "next-auth/middleware";

export default NextAuthMiddleware;

export const config = { matcher: ["/account/:path*"] };

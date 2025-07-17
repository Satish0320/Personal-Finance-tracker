// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login", // Redirect here if unauthenticated
  },
  callbacks: {
    authorized: ({ token }) => {
      return !!token // Allow only if session exists
    },
  },
})

export const config = {
  matcher: [
    "/dashboard",         // protect base page
    "/dashboard/:path*",  // protect nested pages if any
  ],
}

import { clerkMiddleware } from "@clerk/nextjs/server"

// All routes are public — this is a landing page, not an authenticated app.
// Clerk middleware is required for ClerkProvider to function.
export default clerkMiddleware()

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
}

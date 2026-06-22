import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/profile", "/api/products"];
const authRoutes = ["/api/auth/login", "/api/auth/register", "/authentication"];

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));

    const token = req.cookies.get("token")?.value;
    const cookieStore = await cookies();

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/authentication", req.nextUrl))
    }
    
    if(token){
        try{
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JSONWEBTOKEN_SECRET));
            
            if (isProtectedRoute && payload.isVerified === false) {
                return NextResponse.redirect(new URL("/verify-email", req.nextUrl))
            }

            if(isAuthRoute){
                return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
            }
        }catch(error){
            cookieStore.delete("token");
            return NextResponse.redirect(new URL("/authentication", req.nextUrl))
        }
    }

    return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/api/products/:path*',
    '/authentication',
  ],
};

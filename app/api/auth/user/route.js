import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
    try{
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value;
        if(!token) throw new Error("No token")
        const secret = process.env.JSONWEBTOKEN_SECRET
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
        return NextResponse.json(payload ,{ status: 200})
    } catch(err){
        console.log(err)
        const cookieStore = await cookies()
        // cookieStore.delete("token");
        return NextResponse.json({ message: "Unauthorized"}, { status:401 })
    }
}
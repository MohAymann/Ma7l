import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST() {
    try{
        const cookieStore = await cookies();
        cookieStore.delete("token");
        return NextResponse.json({ message: "logged out successfully" }, { status: 200 });
    }catch(err){
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
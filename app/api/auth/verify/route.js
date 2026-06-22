import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
    try {
        const tokenFromUrl = req.nextUrl.searchParams.get('token');
        if (!tokenFromUrl) {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 });
        }

        const client = await clientPromise;
        const collection = client.db("Ma7l").collection("users");

        const user = await collection.findOne({ verificationToken: tokenFromUrl });
        
        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        await collection.updateOne(
            { _id: user._id },
            { 
                $set: { isVerified: true },
                $unset: { verificationToken: "", verificationTokenExpiry: "" }
            }
        );

        // Re-issue JWT token with isVerified: true
        const cookieStore = await cookies()
        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email, phone: user.phone, store_name: user.store_name, isVerified: true }, 
            process.env.JSONWEBTOKEN_SECRET, 
            { expiresIn: "7d" }
        )
        
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })

        return NextResponse.json({ message: "تم تفعيل الحساب بنجاح" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "خطأ داخلي في الخادم" }, { status: 500 });
    }
}

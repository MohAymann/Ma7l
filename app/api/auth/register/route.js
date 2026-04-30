import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { rateLimiter } from "@/lib/ratelimiter";

export async function POST(req) {
    try {
        const cookieStore = await cookies()
        const body = await req.json();
        if (!body) {
            return NextResponse.json({ message: "البيانات غير صحيحة" }, { status: 400 });
        }

        const isAllowed = await rateLimiter(req, { windowMs: 15 * 60 * 1000, limit: 3 })
        if (!isAllowed.ok) {
            return NextResponse.json({ message: "عدد طلبات كثير، يرجى إعادة المحاولة لاحقََا" }, { status: 429 })
        }

        const { name, email, phone, password, store_name } = body
        if (!name || !email || !phone || !password || !store_name || !name.trim() || !email.trim() || !phone.trim() || !password.trim() || !store_name.trim()) {
            return NextResponse.json({ message: "يرجى ملئ جميع الحقول" }, { status: 400 });
        }


        const client = await clientPromise;
        const collection = client.db("Ma7l").collection("users");
        const existingUserEmail = await collection.findOne({ email });
        if (existingUserEmail) {
            return NextResponse.json({ message: "هناك حساب آخر بنفس البريد الالكتروني" }, { status: 400 });
        }

        const existingUserPhone = await collection.findOne({ phone });
        if (existingUserPhone) {
            return NextResponse.json({ message: "هناك حساب آخر بنفس الرقم" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await collection.insertOne({ name, email, phone, password: hashedPassword, store_name, isVerified: false, createdAt: new Date(), updatedAt: new Date() });
        const token = jwt.sign({ userId: user.insertedId, name, email, phone, store_name, isVerified: false }, process.env.JSONWEBTOKEN_SECRET, { expiresIn: "7d" })
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })


        return NextResponse.json({ message: "تم إنشاء حساب بنجاح", userId: user.insertedId }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "خطأ داخلي في الخادم" }, { status: 500 });
    }
}
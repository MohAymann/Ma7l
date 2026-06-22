import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import clientPromise from "@/lib/db";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const cookieStore = await cookies()
        const body = await req.json();
        const { identifier, password } = body;
        const client = await clientPromise;
        const collection = client.db("Ma7l").collection("users");
        if (!identifier || !password || !identifier.trim() || !password.trim()) {
            return NextResponse.json({ message: "البيانات غير صحيحة" }, { status: 400 });
        }
        const user = await collection.findOne({
            $or: [
                { email: identifier.trim().toLowerCase() },
                { phone: identifier.trim() }
            ]
        });
        if (!user) {
            return NextResponse.json({ message: "معرف او كلمة مرور خاطئة" }, { status: 400 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "معرف او كلمة مرور خاطئة" }, { status: 400 });
        }

        const token = jwt.sign({ userId: user._id, name: user.name, phone: user.phone, email: user?.email || null, store_name: user.store_name }, process.env.JSONWEBTOKEN_SECRET, { expiresIn: "7d" });
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return NextResponse.json({ message: "تم تسجيل الدخول بنجاح", userId: user._id }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "حدث خطأ في الخادم، يرجى إعادة المحاولة لاحقََا" }, { status: 500 });
    }
}
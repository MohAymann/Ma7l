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
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }
        const user = await collection.findOne({
            $or: [
                { email: identifier },
                { phone: identifier }
            ]
        });
        if (!user) {
            return NextResponse.json({ message: "invalid identifier or password" }, { status: 400 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "invalid identifier number or password" }, { status: 400 });
        }

        const token = jwt.sign({ userId: user._id, name: user.name, phone: user.phone, email: user?.email || null, store_name: user.store_name }, process.env.JSONWEBTOKEN_SECRET, { expiresIn: "7d" });
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return NextResponse.json({ message: "Login successful", userId: user._id }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
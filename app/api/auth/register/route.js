import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const cookieStore = await cookies()
        const body = await req.json();
        if(!body){
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }
        const { name, email, phone, password, store_name } = body
        if( !name || !email || !phone || !password || !store_name || !name.trim() || !email.trim() || !phone.trim() || !password.trim() || !store_name.trim() ) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const collection = client.db("Ma7l").collection("users");
        const existingUserEmail = await collection.findOne({ email });
        if (existingUserEmail) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }

        const existingUserPhone = await collection.findOne({ phone });
        if (existingUserPhone) {
            return NextResponse.json({ message: "Phone number already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await collection.insertOne({ name, email, phone, hashedPassword, store_name, createdAt: new Date() });
        const token = jwt.sign({ userId: user.insertedId, name, email, phone, store_name },process.env.JSONWEBTOKEN_SECRET, {expiresIn: "7d"})
        cookieStore.set('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })


        return NextResponse.json({ message: "User registered successfully", userId: user.insertedId }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import clientPromise from "@/lib/db";
import { cookies, headers } from "next/headers";




export async function POST(req) {
    try{
        const body = await req.json();
        const { name, barcode, image, stock_quantity, min_stock_limit, buy_price, sell_price, category } = body;
        if (!name || !barcode || !image || !stock_quantity || !min_stock_limit || !buy_price || !sell_price){
            return NextResponse.json({message: "يرجى ملئ جميع البيانات"}, { status:400 })
        };
        let user;
        try{
            const headersList = await headers()
            const token = headersList.get("token");
            const secret = process.env.JSONWEBTOKEN_SECRET;
            if (!secret) throw new Error("Missing JWT secret");
            if (!token) {
                return NextResponse.json({ message: "يرجى إعادة تسجيل الدخول" }, { status: 401 });
            }

            const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
            user = payload;
        }catch(err){
            console.log(err);
            const cookieStore = await cookies();
            cookieStore.delete("token")
            return NextResponse.json({ message: "يرجى اعادة تسجيل الدخول" }, { status: 401 })
        }
        const client = await clientPromise;
        const collection = client.db("Ma7l").collection("products");
        const newProduct = await collection.insertOne({
            ownerId: user.userId,
            barcode,
            image,
            name,
            stock_quantity,
            min_stock_limit,
            buy_price,
            sell_price,
            category
        })

        return NextResponse.json({ message:"product added successfully", newProduct }, { status: 200 })

    }catch (err){
        console.log(err)
        return NextResponse.json({ message: "حدث خطأ في الخادم، يرجى إعادة المحاولة لاحقََا" }, {status: 500})
    }
}
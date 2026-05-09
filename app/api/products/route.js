import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import clientPromise from "@/lib/db";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";


export async function GET(req) {
    try{
        
        const client = await clientPromise;
        const collection = client.db("Ma7l").collection("products");
        let user
        try{
            const cookieStore = await cookies();
            const token = cookieStore.get("token").value;
            if(!token) {throw new Error()}

            const secret = process.env.JSONWEBTOKEN_SECRET
            const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
            user = payload

        } catch(err){
            console.log(err)
            return NextResponse.json({ message: "يرجى إعادة تسجيل الدخول"}, {status: 401})
        }

        const products = await collection.find({ ownerId: user.userId }).toArray();
        return NextResponse.json({ products }, { status:200 } );

    }catch(err) {
        console.log(err)
        return NextResponse.json({message: "حدث خطأفي السيرفر، يرجى إعادة المحاولة لاحقََا"}, {status: 500})
    }
}

export async function POST(req) {
    try{
        const body = await req.json();
        const { name, description, barcode, image, stock_quantity, min_stock_limit, buy_price, sell_price, category } = body;
        if (!name || !description || !barcode || !image || !stock_quantity || !min_stock_limit || !buy_price || !sell_price){
            console.log(name,description,barcode,image,stock_quantity,min_stock_limit,buy_price,sell_price)
            return NextResponse.json({message: "يرجى ملئ جميع البيانات"}, { status:400 })
        };
        let user;
        try{
            const cookieStore = await cookies()
            const token = cookieStore.get("token").value;
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
            description,
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

export async function PATCH(req) {
    try{
        const { targetId, updatedProduct} = await req.json();
        if(!targetId || !updatedProduct) return NextResponse.json({ message: "wrong data"}, { status: 400 })
        const client = await clientPromise;
        const collection = client.db("Ma7l").collection("products");

        const cookieStore = await cookies()
        const token = cookieStore.get("token").value
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JSONWEBTOKEN_SECRET))

        const result = await collection.updateOne({ _id: new ObjectId(targetId), ownerId: payload.userId }, { $set: updatedProduct });
        if(result.matchedCount === 0) return NextResponse.json({ message: "لم يتم العثور على المنتج"}, { status: 404 })

        return NextResponse.json({ message: "تم تعديل المنتج بنجاح"}, { status: 200 })
    }catch(err) {
        console.log(err)
        return NextResponse.json({ message: "حدث خطأ في السيرفر، يرجى المحاولة لاحقََا"}, { status: 500 })
    }
}
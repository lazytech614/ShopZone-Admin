import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request, {params}: {params: {storeId: string}}) => {
    try{
        const {userId} = await auth()
        const body = await req.json()
        const {name, value} = body
        
        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!name) return new NextResponse("Name is required", {status: 400})

        if(!value) return new NextResponse("Value is required", {status: 400})

        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return NextResponse.json(size)
    }catch(err){
        console.log("sizes/post", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const GET = async (req: Request, {params}: {params: {storeId: string}}) => {
    try{
        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(sizes)
    }catch(err){
        console.log("sizes/get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}
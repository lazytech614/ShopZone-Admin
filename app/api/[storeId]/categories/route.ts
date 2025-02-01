import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request, {params}: {params: {storeId: string}}) => {
    try{
        const {userId} = await auth()
        const body = await req.json()
        const {name, billboardId} = body
        
        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!name) return new NextResponse("Name is required", {status: 400})

        if(!billboardId) return new NextResponse("Billboard ID URL is required", {status: 400})

        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category)
    }catch(err){
        console.log("categories/post", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const GET = async (req: Request, {params}: {params: {storeId: string}}) => {
    try{
        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(categories)
    }catch(err){
        console.log("categories/get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}
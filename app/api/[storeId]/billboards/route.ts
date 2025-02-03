import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request, {params}: {params: {storeId: string}}) => {
    try{
        const {userId} = await auth()
        const body = await req.json()
        const {label, imageUrl} = body
        
        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!label) return new NextResponse("Label is required", {status: 400})

        if(!imageUrl) return new NextResponse("Image URL is required", {status: 400})

        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)
    }catch(err){
        console.log("billboards/post", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const GET = async (req: Request, {params}: {params: {storeId: string}}) => {
    try{
        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            }
        })

        return NextResponse.json(billboards)
    }catch(err){
        console.log("billboards/get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}
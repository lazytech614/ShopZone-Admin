import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try{
        const {userId} = await auth()
        const body = await req.json()
        
        if(!userId) return new NextResponse("Unauthorized", {status: 401})

        const {name} = body
        if(!name) return new NextResponse("Name is required", {status: 400})

        const store = await prismadb.store.create({
            data: {
                userId,
                name,
            }
        })

        return NextResponse.json(store)
    }catch(err){
        console.log("stores/post", err);
        return new NextResponse("Internal server error.", {status: 500})
    }finally{}
}
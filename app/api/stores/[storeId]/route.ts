import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export const PATCH = async (req: Request, {params}: {params: {storeId: string}}) => {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const {name} = body

        if(!userId) return new NextResponse("Unauthorized", {status: 401})

        if(!name) return new NextResponse("Name is required", {status: 400})

        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json(store)
    }catch(err) {
        console.log("store patch", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const DELETE = async (req: Request, {params}: {params: {storeId: string}}) => {
    try {
        const {userId} = await auth()

        if(!userId) return new NextResponse("Unauthorized", {status: 401})

        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        })

        return NextResponse.json(store)
    }catch(err) {
        console.log("delete store", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}
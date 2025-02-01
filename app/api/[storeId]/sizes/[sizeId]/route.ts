import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import prismadb from "@/lib/prismadb"

export const GET = async (req: Request, {params}: {params: {sizeId: string}}) => {
    try {
        if(!params.sizeId) return new NextResponse("Size ID is required", {status: 400})

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            }
        })

        return NextResponse.json(size)
    }catch(err) {
        console.log("size get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const PATCH = async (req: Request, {params}: {params: {storeId: string, sizeId: string}}) => {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const {name, value} = body

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!name) return new NextResponse("Name is required", {status: 400})

        if(!value) return new NextResponse("Value is required", {status: 400})

        if(!params.sizeId) return new NextResponse("Category ID is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size)
    }catch(err) {
        console.log("size patch", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const DELETE = async (req: Request, {params}: {params: {storeId: string, sizeId: string}}) => {
    try {
        const {userId} = await auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!params.sizeId) return new NextResponse("Category ID is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        })

        return NextResponse.json(size)
    }catch(err) {
        console.log("delete size", err);
        return new NextResponse("Internal server error.", {status: 500 })
    }
}
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import prismadb from "@/lib/prismadb"

export const GET = async (req: Request, {params}: {params: {colorId: string}}) => {
    try {
        if(!params.colorId) return new NextResponse("Size ID is required", {status: 400})

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        })

        return NextResponse.json(color)
    }catch(err) {
        console.log("color get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const PATCH = async (req: Request, {params}: {params: {storeId: string, colorId: string}}) => {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const {name, value} = body

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!name) return new NextResponse("Name is required", {status: 400})

        if(!value) return new NextResponse("Value is required", {status: 400})

        if(!params.colorId) return new NextResponse("Category ID is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(color)
    }catch(err) {
        console.log("color patch", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const DELETE = async (req: Request, {params}: {params: {storeId: string, colorId: string}}) => {
    try {
        const {userId} = await auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!params.colorId) return new NextResponse("Category ID is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        })

        return NextResponse.json(color)
    }catch(err) {
        console.log("delete color", err);
        return new NextResponse("Internal server error.", {status: 500 })
    }
}
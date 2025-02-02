import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import prismadb from "@/lib/prismadb"

export const GET = async (req: Request, {params}: {params: {billboardId: string}}) => {
    try {
        if(!params.billboardId) return new NextResponse("Billboard id is required", {status: 400})

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json(billboard)
    }catch(err) {
        console.log("billboard get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const PATCH = async (req: Request, {params}: {params: {storeId: string, billboardId: string}}) => {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const {label, imageUrl} = body

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!label) return new NextResponse("Label is required", {status: 400})

        if(!imageUrl) return new NextResponse("Image URL is required", {status: 400})

        if(!params.billboardId) return new NextResponse("Billboard id is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)
    }catch(err) {
        console.log("billboard patch", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const DELETE = async (req: Request, {params}: {params: {storeId: string, billboardId: string}}) => {
    try {
        const {userId} = await auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!params.billboardId) return new NextResponse("Billboard id is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        })

        return NextResponse.json(billboard)
    }catch(err) {
        console.log("billboard delete", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}
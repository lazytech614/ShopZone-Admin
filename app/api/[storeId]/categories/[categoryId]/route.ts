import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import prismadb from "@/lib/prismadb"

export const GET = async (req: Request, {params}: {params: {categoryId: string}}) => {
    try {
        if(!params.categoryId) return new NextResponse("Category ID is required", {status: 400})

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId
            },
            // include: {
            //     billboard: true
            // }
        })

        return NextResponse.json(category)
    }catch(err) {
        console.log("category get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const PATCH = async (req: Request, {params}: {params: {storeId: string, categoryId: string}}) => {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const {name} = body

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!name) return new NextResponse("Name is required", {status: 400})

        // if(!billboardId) return new NextResponse("Billboard ID is required", {status: 400})

        if(!params.categoryId) return new NextResponse("Category ID is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                // billboardId
            }
        })

        return NextResponse.json(category)
    }catch(err) {
        console.log("category patch", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const DELETE = async (req: Request, {params}: {params: {storeId: string, categoryId: string}}) => {
    try {
        const {userId} = await auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!params.categoryId) return new NextResponse("Category ID is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        })

        return NextResponse.json(category)
    }catch(err) {
        console.log("delete category", err);
        return new NextResponse("Internal server error.", {status: 500 })
    }
}
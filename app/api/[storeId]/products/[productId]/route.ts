import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import prismadb from "@/lib/prismadb"

export const GET = async (req: Request, {params}: {params: {productId: string}}) => {
    try {
        if(!params.productId) return new NextResponse("Product id is required", {status: 400})

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        })

        return NextResponse.json(product)
    }catch(err) {
        console.log("product get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const PATCH = async (req: Request, {params}: {params: {storeId: string, productId: string}}) => {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const {
            name,
            price,
            categoryId,
            sizeId,
            colorId,
            images,
            productDescription,
            material,
            brand,
            quantity,
            isFeatured,
            isArchived
        } = body

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!name) return new NextResponse("Name is required", {status: 400})

        if(!price) return new NextResponse("Price is required", {status: 400})

        if(!categoryId) return new NextResponse("Category id is required", {status: 400})

        if(!sizeId) return new NextResponse("Size id is required", {status: 400})

        if(!colorId) return new NextResponse("Color id is required", {status: 400})

        if(!images || !images.length) return new NextResponse("Images are required", {status: 400})

        if(!params.productId) return new NextResponse("Product id is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                images: {
                    deleteMany: {},
                },
                productDescription,
                material,
                brand,
                quantity,
                isFeatured,
                isArchived
            }
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: images.map((image: { url: string }) => ({
                          imageUrl: image.url,
                        }))
                      }
                }
            }
        })

        return NextResponse.json(product)
    }catch(err) {
        console.log("product patch", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const DELETE = async (req: Request, {params}: {params: {storeId: string, productId: string}}) => {
    try {
        const {userId} = await auth()

        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!params.productId) return new NextResponse("Product id is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        })

        return NextResponse.json(product)
    }catch(err) {
        console.log("product delete", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}
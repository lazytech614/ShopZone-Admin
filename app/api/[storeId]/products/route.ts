import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request, {params}: {params: {storeId: string}}) => {
    try{
        const {userId} = await auth()
        const body = await req.json()
        const {
            name,
            price,
            images,
            categoryId,
            sizeId,
            colorId,
            quantity,
            material,
            productDescription,
            brand,
            isFeatured,
            isArchived
        } = body
        
        if(!userId) return new NextResponse("Unauthenticated", {status: 401})

        if(!name) return new NextResponse("Name is required", {status: 400})

        if(!price) return new NextResponse("Price is required", {status: 400})

        if(!images || !images.length) return new NextResponse("Images are required", {status: 400})

        if(!categoryId) return new NextResponse("Category id is required", {status: 400})

        if(!sizeId) return new NextResponse("Size id is required", {status: 400})

        if(!colorId) return new NextResponse("Color id is required", {status: 400})

        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        console.log("Store", storeByUserId);

        if(!storeByUserId) return new NextResponse("Unauthorized", {status: 403})

            
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                images: {
                    createMany: {
                        data: images.map((image: { url: string }) => ({
                          imageUrl: image.url,
                        }))
                      }
                },
                categoryId,
                sizeId,
                colorId,
                quantity,
                material,
                productDescription,
                brand,
                isFeatured,
                isArchived,
                storeId: params.storeId
            }
        })

        return NextResponse.json(product)
    }catch(err){
        console.log("products/post", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}

export const GET = async (req: Request, {params}: {params: {storeId: string}}) => {
    try{
        const {searchParams} = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const isFeatured = searchParams.get("isFeatured")


        if(!params.storeId) return new NextResponse("Store id is required", {status: 400})

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                sizeId,
                colorId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(products)
    }catch(err){
        console.log("products/get", err);
        return new NextResponse("Internal server error.", {status: 500})
    }
}
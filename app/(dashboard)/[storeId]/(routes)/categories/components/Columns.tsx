"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./CellAction"
import Image from "next/image"

export type CategoryColumn = {
  id: string
  name: string
  // billboardLabel: string
  categoryImage: string
  createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "categoryImage",
    header: "Image",
    cell: ({ row }) => <Image 
                          alt="Category" 
                          src={row.original.categoryImage} 
                          width={100} 
                          height={100} 
                          className="object-cover object-center"
                        />
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>
  }
]

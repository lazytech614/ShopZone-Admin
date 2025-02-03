"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./CellAction"

export type ProductColumn = {
  id: string
  name: string
  price: string
  size: string
  color: string
  category: string
  quantity: number
  material: string | null
  brand: string | null
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({row}) => {
      const color = row.original.color
      return (
        <div className="flex items-center gap-x-2">
          {color}
          <div className="w-6 h-6 rounded-full border" style={{backgroundColor: color}} />
        </div>
      )
    }
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "material",
    header: "Material",
  },
  {
    accessorKey: "brand",
    header: "Brand",
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

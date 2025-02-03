"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./CellAction"

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
  isActive: boolean
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "isActive",
    header: "Active",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original}/>
  }
]

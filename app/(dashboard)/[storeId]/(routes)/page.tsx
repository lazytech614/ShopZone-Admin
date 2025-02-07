import React from 'react'
import { 
  CreditCardIcon, 
  DollarSignIcon, 
  PackageIcon 
} from 'lucide-react'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { formattorPrice } from '@/lib/utils'
import { getTotalRevenue } from '@/actions/getTotalRevenue'
import { getSalesCount } from '@/actions/getSalesCount'
import { getStockCount } from '@/actions/getStockCount'
import Overview from '@/components/Overview'
import { getRevenueGraph } from '@/actions/getRevenueGraph'

interface DashboardPageProps {
  params: {
    storeId: string
  }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({params}) => {
  const totalRevenue = await getTotalRevenue(params.storeId)
  const salesCount = await getSalesCount(params.storeId)
  const stockCount = await getStockCount(params.storeId)

  const revenueGraph = await getRevenueGraph(params.storeId)

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Heading 
          title='Dashboard' 
          description='Overview of your store' 
        />
        <Separator />
        <div className='grid grid-cols-3 gap-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium capitalize'>
                Total Revenue
              </CardTitle>
              <DollarSignIcon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formattorPrice(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium capitalize'>
                Sales
              </CardTitle>
              <CreditCardIcon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                +{salesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium capitalize'>
                Products in stock
              </CardTitle>
              <PackageIcon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className='col-span-4'>
          <CardHeader>
            Overview
          </CardHeader>
          <CardContent className='pl-2'>
            <Overview data={revenueGraph} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
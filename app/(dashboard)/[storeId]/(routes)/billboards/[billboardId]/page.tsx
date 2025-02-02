// app/(dashboard)/[storeId]/(routes)/billboards/[billboardId]/page.tsx
import prismadb from '@/lib/prismadb';
import BillboardForm from './components/BillboardForm';

interface PageParams {
  storeId: string;
  billboardId: string;
}

export default async function BillboardPage({
  params
}: {
  params: PageParams
}) {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
      storeId: params.storeId
    }
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm 
          initialData={billboard}
        />
      </div>
    </div>
  );
}
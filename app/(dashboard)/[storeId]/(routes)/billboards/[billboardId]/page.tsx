import React from 'react';
import prismadb from '@/lib/prismadb';
import BillboardForm from './components/BillboardForm';

interface PageProps {
  params: {
    billboardId: string;
    storeId: string; // Add this if you have multiple dynamic segments
  };
}

export default async function BillboardPage({ params }: PageProps) {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}
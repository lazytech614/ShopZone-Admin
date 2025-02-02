import React from 'react';
import { NextPage } from 'next';
import prismadb from '@/lib/prismadb';
import BillboardForm from './components/BillboardForm';

interface BillboardPageProps {
  params: {
    billboardId: string;
  };
}

const BillboardPage: NextPage<BillboardPageProps> = async ({ params }) => {
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
};

export default BillboardPage;
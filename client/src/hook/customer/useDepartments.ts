import { useQuery } from '@tanstack/react-query';

interface Department {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  color: string;
}

export const useDepartments = () => {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      // In a production app, you would fetch this from an API:
      // const response = await api.get('/departments');
      // return response.data;

      // Static data implementation
      return [
        {
          id: 'funding-wallet',
          name: 'Funding Wallet',
          icon: <FiCreditCard className="text-2xl" />,
          description: 'Issues with account funding and wallet transactions',
          color: 'text-blue-600 bg-blue-100',
        },
        {
          id: 'airtime',
          name: 'Buying Airtime',
          icon: <FiSmartphone className="text-2xl" />,
          description: 'Problems purchasing airtime or mobile top-ups',
          color: 'text-purple-600 bg-purple-100',
        },
        {
          id: 'internet-data',
          name: 'Buying Internet Data',
          icon: <FiWifi className="text-2xl" />,
          description: 'Troubles with data bundles and internet packages',
          color: 'text-green-600 bg-green-100',
        },
        {
          id: 'ecommerce',
          name: 'E-commerce Section',
          icon: <FiShoppingCart className="text-2xl" />,
          description: 'Questions about online purchases and orders',
          color: 'text-yellow-600 bg-yellow-100',
        },
        {
          id: 'fraud',
          name: 'Fraud Related Problems',
          icon: <FiShield className="text-2xl" />,
          description: 'Report suspicious activity or security concerns',
          color: 'text-red-600 bg-red-100',
        },
        {
          id: 'general',
          name: 'General Services',
          icon: <FiHelpCircle className="text-2xl" />,
          description: 'Other questions and support requests',
          color: 'text-indigo-600 bg-indigo-100',
        },
      ];
    },
    staleTime: Infinity, // Static data doesn't need refetching
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

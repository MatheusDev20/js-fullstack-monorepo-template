import { useQuery } from '@tanstack/react-query';
import { GET } from '../libs/axios/handlers';

export const getSomeData = async (): Promise<any[]> => {
  const response = await GET<any[]>({
    path: '/random-path',
    authenticated: false,
  });

  const { body } = response;
  return body;
};

/* Hook Itself */
export const useStreaming = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['streaming'],
    queryFn: getSomeData,
  });

  return {
    data,
    error,
    isLoading,
  };
};

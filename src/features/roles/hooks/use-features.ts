import { useQuery } from '@tanstack/react-query';
import { getFeatures } from '../api';
import type { GetFeaturesParams } from '../types';

export function useFeatures(params?: GetFeaturesParams) {
  return useQuery({
    queryKey: ['features', params],
    queryFn: () => getFeatures(params),
  });
}

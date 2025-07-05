import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { type QueryConfig } from "@/lib/react-query";
import type { Example } from "../types";
export const getExamples = (
  page = 1
): Promise<{
  data: Example[];
}> => {
  return api.get(`/examples`, {
    params: {
      page,
    },
  });
};

export const getExamplesQueryOptions = ({ page }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ["examples", { page }] : ["examples"],
    queryFn: () => getExamples(page),
  });
};

type UseExamplesOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getExamplesQueryOptions>;
};

export const useExamples = ({ queryConfig, page }: UseExamplesOptions) => {
  return useQuery({
    ...getExamplesQueryOptions({ page }),
    ...queryConfig,
  });
};

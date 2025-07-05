import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { type QueryConfig } from "@/lib/react-query";
import type { Example } from "../types";

export const getExample = ({
  exampleId,
}: {
  exampleId: string;
}): Promise<{ data: Example }> => {
  return api.get(`/examples/${exampleId}`);
};

export const getExampleQueryOptions = (exampleId: string) => {
  return queryOptions({
    queryKey: ["examples", exampleId],
    queryFn: () => getExample({ exampleId }),
  });
};

type UseExampleOptions = {
  exampleId: string;
  queryConfig?: QueryConfig<typeof getExampleQueryOptions>;
};

export const useExample = ({ exampleId, queryConfig }: UseExampleOptions) => {
  return useQuery({
    ...getExampleQueryOptions(exampleId),
    ...queryConfig,
  });
};

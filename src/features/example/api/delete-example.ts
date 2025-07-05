import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import { type MutationConfig } from "@/lib/react-query";

export const deleteExample = ({ exampleId }: { exampleId: string }) => {
  return api.delete(`/examples/${exampleId}`);
};

type UseDeleteExampleOptions = {
  mutationConfig?: MutationConfig<typeof deleteExample>;
};

export const useDeleteExample = ({
  mutationConfig,
}: UseDeleteExampleOptions = {}) => {
  return useMutation({
    mutationFn: deleteExample,
    ...mutationConfig,
  });
};

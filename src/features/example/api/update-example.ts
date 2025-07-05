import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { type MutationConfig } from "@/lib/react-query";
import type { Example } from "../types";

export const updateExampleInputSchema = z.object({
  name: z.string().min(1, "Required"),
});

export type UpdateExampleInput = z.infer<typeof updateExampleInputSchema>;

export const updateExample = ({
  data,
  exampleId,
}: {
  data: UpdateExampleInput;
  exampleId: string;
}): Promise<Example> => {
  return api.patch(`/examples/${exampleId}`, data);
};

type UseUpdateExampleOptions = {
  mutationConfig?: MutationConfig<typeof updateExample>;
};

export const useUpdateExample = ({
  mutationConfig,
}: UseUpdateExampleOptions = {}) => {
  return useMutation({
    mutationFn: updateExample,
    ...mutationConfig,
  });
};

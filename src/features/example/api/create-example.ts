import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import { type MutationConfig } from "@/lib/react-query";
import type { Example } from "../types";

export const createExampleInputSchema = z.object({
  name: z.string().min(1, "Required"),
});

export type CreateExampleInput = z.infer<typeof createExampleInputSchema>;

export const createExample = ({
  data,
}: {
  data: CreateExampleInput;
}): Promise<Example> => {
  return api.post(`/examples`, data);
};

type UseCreateExampleOptions = {
  mutationConfig?: MutationConfig<typeof createExample>;
};

export const useCreateExample = ({
  mutationConfig,
}: UseCreateExampleOptions = {}) => {
  return useMutation({ mutationFn: createExample, ...mutationConfig });
};

import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

interface DataFetcherState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface DataFetcherProps<T> {
  queryKey: unknown[];
  queryFn: () => Promise<T>;
  /* Render prop : le consommateur décide entièrement de l'affichage */
  children: (state: DataFetcherState<T>) => ReactNode;
}

/**
 * Pattern render props : la logique de chargement est mutualisée, le rendu
 * reste à l'appelant. Utile quand deux écrans affichent la même donnée
 * de manière très différente.
 */
export default function DataFetcher<T>({
  queryKey,
  queryFn,
  children,
}: DataFetcherProps<T>) {
  const { data, isLoading, error, refetch } = useQuery({ queryKey, queryFn });

  return children({
    data,
    isLoading,
    error: error as Error | null,
    refetch: () => void refetch(),
  });
}

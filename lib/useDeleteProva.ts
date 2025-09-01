// lib/useDeleteProva.ts
import { useState } from "react";
import axiosInstance from "./axiosInstance";

export function useDeleteProva() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProva = async (idProva: number | string) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Deletando prova ID:", idProva);
      await axiosInstance.delete(`/prova/${idProva}`);
      console.log("Prova deletada com sucesso");
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao deletar prova";
      setError(errorMessage);
      console.error("Erro ao deletar prova:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProva, loading, error };
}

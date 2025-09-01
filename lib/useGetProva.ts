// lib/useGetProva.ts
import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

interface Professor {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  matriculaGeral: string;
  disciplinas: string[];
}

interface Disciplina {
  id: number;
  nome: string;
  professor: Professor;
}

interface Questao {
  id: number;
  descricao: string;
  alternativaCorreta: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaE: string;
}

interface Resultado {
  idAluno: number;
  idQuestao: number;
  resposta: string;
  acertou: boolean;
}

export interface Prova {
  id: number;
  disciplina: Disciplina;
  titulo: string;
  descricao: string;
  data: string;
  totalQuestoes: number;
  questoes: Questao[];
  resultados: Resultado[];
  ativa?: boolean;
}

export function useGetProva(idProva: number | string | null) {
  const [prova, setProva] = useState<Prova | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idProva) return;

    const fetchProva = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Buscando prova ID:", idProva);
        const response = await axiosInstance.get<Prova>(`/prova/${idProva}`);
        console.log("Prova encontrada:", response.data);

        // Garante que o campo ativa seja boolean
        const provaData = {
          ...response.data,
          ativa: Boolean(response.data.ativa),
        };

        setProva(provaData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao carregar prova");
        console.error("Erro ao buscar prova:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProva();
  }, [idProva]);

  return { prova, loading, error };
}

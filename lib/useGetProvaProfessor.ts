// lib/useProvasProfessor.ts
import { useState, useEffect, useCallback } from "react";
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

export function useProvasProfessor(idProfessor: number | string | null) {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvas = useCallback(async () => {
    if (!idProfessor) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<Prova[]>("/prova");
      console.log("Resposta completa da API:", response.data);

      // Filtrar apenas as provas deste professor
      const provasDoProfessor = response.data.filter(
        (prova) =>
          prova.disciplina.professor.id.toString() === idProfessor.toString()
      );

      // Garantir que o campo ativa seja sempre boolean e mostrar debug
      const provasComStatus = provasDoProfessor.map((prova) => {
        console.log(
          `Prova ${prova.id} - ativa:`,
          prova.ativa,
          "tipo:",
          typeof prova.ativa
        );
        return {
          ...prova,
          ativa: Boolean(prova.ativa), // Força conversão para boolean
        };
      });

      console.log("Provas processadas:", provasComStatus);
      setProvas(provasComStatus);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      console.error("Erro ao buscar provas:", err);
    } finally {
      setLoading(false);
    }
  }, [idProfessor]);

  useEffect(() => {
    fetchProvas();
  }, [fetchProvas]);

  const refetch = useCallback(() => {
    fetchProvas();
  }, [fetchProvas]);

  return { provas, loading, error, refetch };
}

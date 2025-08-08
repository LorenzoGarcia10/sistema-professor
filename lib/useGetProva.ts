import { useState, useEffect } from "react"
import axiosInstance from "./axiosInstance"  // ajuste o caminho conforme seu projeto

interface Professor {
  id: number
  nome: string
  email: string
  cpf: string
  matriculaGeral: string
  disciplinas: string[]
}

interface Disciplina {
  id: number
  nome: string
  professor: Professor
}

interface Questao {
  id: number
  descricao: string
  alternativaCorreta: string
  alternativaA: string
  alternativaB: string
  alternativaC: string
  alternativaD: string
  alternativaE: string
}

interface Resultado {
  idAluno: number
  idQuestao: number
  resposta: string
  acertou: boolean
}

export interface Prova {
  id: number
  disciplina: Disciplina
  titulo: string
  descricao: string
  data: string
  totalQuestoes: number
  questoes: Questao[]
  resultados: Resultado[]
}

export function useProva(idProva: number | string) {
  const [prova, setProva] = useState<Prova | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!idProva) return

    setLoading(true)
    setError(null)

    axiosInstance
      .get<Prova>(`/prova/${idProva}`)
      .then(response => {
        setProva(response.data)
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message)
      })
      .finally(() => setLoading(false))
  }, [idProva])

  return { prova, loading, error }
}

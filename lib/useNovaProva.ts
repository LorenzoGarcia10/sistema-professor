"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance" // ajuste o caminho conforme seu projeto

interface QuestaoCadastro {
  descricao: string
  alternativaCorreta: string
  alternativaA: string
  alternativaB: string
  alternativaC: string
  alternativaD: string
  alternativaE: string
}

interface ProvaCadastro {
  disciplinaId: number
  titulo: string
  descricao: string
  data: string
  questoes: QuestaoCadastro[]
}

export function useCriarProva() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function criarProva(prova: ProvaCadastro) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await axiosInstance.post("/prova/cadastro", prova)
      setSuccess(true)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erro ao criar prova")
    } finally {
      setLoading(false)
    }
  }

  return {
    criarProva,
    loading,
    error,
    success,
  }
}

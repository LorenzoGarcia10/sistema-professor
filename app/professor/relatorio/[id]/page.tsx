"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Download, Users, TrendingUp } from "lucide-react"

interface Resultado {
  provaId: string
  alunoEmail: string
  alunoNome: string
  nota: string
  acertos: number
  totalQuestoes: number
  data: string
}

interface Prova {
  id: string
  titulo: string
  descricao: string
  questoes: any[]
}

export default function RelatorioPage() {
  const [prova, setProva] = useState<Prova | null>(null)
  const [resultados, setResultados] = useState<Resultado[]>([])
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.userType !== "professor") {
      router.push("/")
      return
    }

    // Carregar prova
    const provasData = localStorage.getItem("provas")
    if (provasData) {
      const provas = JSON.parse(provasData)
      const provaEncontrada = provas.find((p: Prova) => p.id === params.id)
      if (provaEncontrada) {
        setProva(provaEncontrada)
      }
    }

    // Carregar resultados
    const resultadosData = localStorage.getItem("resultados")
    if (resultadosData) {
      const todosResultados = JSON.parse(resultadosData)
      const resultadosProva = todosResultados.filter((r: Resultado) => r.provaId === params.id)
      setResultados(resultadosProva)
    }
  }, [params.id, router])

  const calcularEstatisticas = () => {
    if (resultados.length === 0) return null

    const notas = resultados.map((r) => Number.parseFloat(r.nota))
    const media = notas.reduce((a, b) => a + b, 0) / notas.length
    const notaMaxima = Math.max(...notas)
    const notaMinima = Math.min(...notas)
    const aprovados = notas.filter((n) => n >= 7).length
    const percentualAprovacao = (aprovados / notas.length) * 100

    return {
      media: media.toFixed(1),
      notaMaxima: notaMaxima.toFixed(1),
      notaMinima: notaMinima.toFixed(1),
      aprovados,
      percentualAprovacao: percentualAprovacao.toFixed(1),
    }
  }

  const exportarRelatorio = () => {
    const stats = calcularEstatisticas()
    let conteudo = `Relatório da Prova: ${prova?.titulo}\n\n`

    if (stats) {
      conteudo += `ESTATÍSTICAS GERAIS:\n`
      conteudo += `Total de alunos: ${resultados.length}\n`
      conteudo += `Média da turma: ${stats.media}\n`
      conteudo += `Nota máxima: ${stats.notaMaxima}\n`
      conteudo += `Nota mínima: ${stats.notaMinima}\n`
      conteudo += `Aprovados (≥7.0): ${stats.aprovados}\n`
      conteudo += `Percentual de aprovação: ${stats.percentualAprovacao}%\n\n`
    }

    conteudo += `RESULTADOS INDIVIDUAIS:\n`
    resultados.forEach((resultado) => {
      conteudo += `${resultado.alunoNome} - Nota: ${resultado.nota} (${resultado.acertos}/${resultado.totalQuestoes})\n`
    })

    const blob = new Blob([conteudo], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${prova?.titulo.replace(/\s+/g, "-")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = calcularEstatisticas()

  if (!prova) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button onClick={() => router.push("/professor/dashboard")} variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Relatório da Prova</h1>
                <p className="text-gray-600">{prova.titulo}</p>
              </div>
            </div>
            {resultados.length > 0 && (
              <Button onClick={exportarRelatorio}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resultados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhum aluno realizou esta prova ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Estatísticas */}
            {stats && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{resultados.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Média da Turma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.media}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Aprovados (≥7.0)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.aprovados}</div>
                    <p className="text-xs text-gray-500">{stats.percentualAprovacao}% da turma</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Variação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="text-green-600">Máx: {stats.notaMaxima}</div>
                      <div className="text-red-600">Mín: {stats.notaMinima}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Lista de Resultados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Resultados Individuais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Aluno</th>
                        <th className="text-center py-2">Nota</th>
                        <th className="text-center py-2">Acertos</th>
                        <th className="text-center py-2">Data</th>
                        <th className="text-center py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados
                        .sort((a, b) => Number.parseFloat(b.nota) - Number.parseFloat(a.nota))
                        .map((resultado, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3">{resultado.alunoNome}</td>
                            <td className="text-center py-3 font-semibold">
                              <span
                                className={`${
                                  Number.parseFloat(resultado.nota) >= 7
                                    ? "text-green-600"
                                    : Number.parseFloat(resultado.nota) >= 5
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {resultado.nota}
                              </span>
                            </td>
                            <td className="text-center py-3">
                              {resultado.acertos}/{resultado.totalQuestoes}
                            </td>
                            <td className="text-center py-3 text-sm text-gray-600">
                              {new Date(resultado.data).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="text-center py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  Number.parseFloat(resultado.nota) >= 7
                                    ? "bg-green-100 text-green-800"
                                    : Number.parseFloat(resultado.nota) >= 5
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {Number.parseFloat(resultado.nota) >= 7
                                  ? "Aprovado"
                                  : Number.parseFloat(resultado.nota) >= 5
                                    ? "Recuperação"
                                    : "Reprovado"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

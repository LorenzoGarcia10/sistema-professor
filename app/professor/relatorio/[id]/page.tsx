"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Download, Users, TrendingUp } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance"; // Ajuste o caminho conforme seu projeto

interface Resultado {
  provaId: string;
  alunoEmail: string;
  alunoNome: string;
  nota: string;
  acertos: number;
  totalQuestoes: number;
  data: string;
}

interface Prova {
  id: string;
  titulo: string;
  descricao: string;
  questoes: any[];
}

export default function RelatorioPage() {
  const [prova, setProva] = useState<Prova | null>(null);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Verifica usuário autenticado
        const userData = localStorage.getItem("user");
        if (!userData) {
          router.push("/");
          return;
        }
        const parsedUser = JSON.parse(userData);
        if (parsedUser.userType !== "professor") {
          router.push("/");
          return;
        }

        // Busca prova
        const provaResponse = await axiosInstance.get<Prova>(
          `/provas/${params.id}`
        );
        setProva(provaResponse.data);

        // Busca resultados da prova
        const resultadosResponse = await axiosInstance.get<Resultado[]>(
          `/provas/${params.id}/resultados`
        );
        setResultados(resultadosResponse.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Erro ao carregar dados"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, router]);

  const calcularEstatisticas = () => {
    if (resultados.length === 0) return null;

    const notas = resultados.map((r) => Number.parseFloat(r.nota));
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;
    const notaMaxima = Math.max(...notas);
    const notaMinima = Math.min(...notas);
    const aprovados = notas.filter((n) => n >= 7).length;
    const percentualAprovacao = (aprovados / notas.length) * 100;

    return {
      media: media.toFixed(1),
      notaMaxima: notaMaxima.toFixed(1),
      notaMinima: notaMinima.toFixed(1),
      aprovados,
      percentualAprovacao: percentualAprovacao.toFixed(1),
    };
  };

  const exportarRelatorio = () => {
    const stats = calcularEstatisticas();
    let conteudo = `Relatório da Prova: ${prova?.titulo}\n\n`;

    if (stats) {
      conteudo += `ESTATÍSTICAS GERAIS:\n`;
      conteudo += `Total de alunos: ${resultados.length}\n`;
      conteudo += `Média da turma: ${stats.media}\n`;
      conteudo += `Nota máxima: ${stats.notaMaxima}\n`;
      conteudo += `Nota mínima: ${stats.notaMinima}\n`;
      conteudo += `Aprovados (≥7.0): ${stats.aprovados}\n`;
      conteudo += `Percentual de aprovação: ${stats.percentualAprovacao}%\n\n`;
    }

    conteudo += `RESULTADOS INDIVIDUAIS:\n`;
    resultados.forEach((resultado) => {
      conteudo += `${resultado.alunoNome} - Nota: ${resultado.nota} (${resultado.acertos}/${resultado.totalQuestoes})\n`;
    });

    const blob = new Blob([conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${prova?.titulo.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = calcularEstatisticas();

  if (loading) return <p className="text-center mt-8">Carregando dados...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;
  if (!prova) return <p className="text-center mt-8">Prova não encontrada.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button
                onClick={() => router.push("/professor/dashboard")}
                variant="ghost"
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Relatório da Prova
                </h1>
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
              <p className="text-gray-600">
                Nenhum aluno realizou esta prova ainda.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Estatísticas */}
            {stats && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total de Alunos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {resultados.length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Média da Turma
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.media}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Aprovados (≥7.0)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.aprovados}
                    </div>
                    <p className="text-xs text-gray-500">
                      {stats.percentualAprovacao}% da turma
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Variação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="text-green-600">
                        Máx: {stats.notaMaxima}
                      </div>
                      <div className="text-red-600">
                        Mín: {stats.notaMinima}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Resultados Individuais */}
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
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2">{r.alunoNome}</td>
                          <td className="py-2 text-center font-semibold">
                            {r.nota}
                          </td>
                          <td className="py-2 text-center">
                            {r.acertos}/{r.totalQuestoes}
                          </td>
                          <td className="py-2 text-center">
                            {new Date(r.data).toLocaleDateString()}
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
  );
}

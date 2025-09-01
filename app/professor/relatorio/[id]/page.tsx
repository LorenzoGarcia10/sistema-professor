"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Download, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetProva } from "@/lib/useGetProva"; // Importe o hook correto

// Interface para o resultado agrupado por aluno
interface ResultadoAluno {
  idAluno: number;
  nomeAluno?: string;
  emailAluno?: string;
  respostas: {
    idQuestao: number;
    resposta: string;
    acertou: boolean;
  }[];
  nota: number;
  acertos: number;
  totalQuestoes: number;
}

export default function RelatorioPage() {
  const router = useRouter();
  const params = useParams();
  const [resultadosAgrupados, setResultadosAgrupados] = useState<
    ResultadoAluno[]
  >([]);

  // Usa o hook useGetProva para buscar a prova específica
  const { prova, loading, error } = useGetProva(params.id as string);

  // Checagem de usuário autenticado
  useEffect(() => {
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
  }, [router]);

  // Processar resultados quando a prova for carregada
  useEffect(() => {
    if (prova && prova.resultados) {
      // Agrupar resultados por aluno
      const resultadosPorAluno: { [key: number]: ResultadoAluno } = {};

      prova.resultados.forEach((resultado: any) => {
        if (!resultadosPorAluno[resultado.idAluno]) {
          resultadosPorAluno[resultado.idAluno] = {
            idAluno: resultado.idAluno,
            respostas: [],
            nota: 0,
            acertos: 0,
            totalQuestoes: prova.questoes.length,
          };
        }

        resultadosPorAluno[resultado.idAluno].respostas.push({
          idQuestao: resultado.idQuestao,
          resposta: resultado.resposta,
          acertou: resultado.acertou,
        });

        if (resultado.acertou) {
          resultadosPorAluno[resultado.idAluno].acertos++;
        }
      });

      // Calcular nota para cada aluno
      Object.values(resultadosPorAluno).forEach((aluno) => {
        aluno.nota = (aluno.acertos / aluno.totalQuestoes) * 10;
      });

      setResultadosAgrupados(Object.values(resultadosPorAluno));
    }
  }, [prova]);

  const calcularEstatisticas = () => {
    if (resultadosAgrupados.length === 0) return null;

    const notas = resultadosAgrupados.map((aluno) => aluno.nota);
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;
    const notaMaxima = Math.max(...notas);
    const notaMinima = Math.min(...notas);
    const aprovados = notas.filter((nota) => nota >= 7).length;
    const percentualAprovacao = (aprovados / notas.length) * 100;

    return {
      media: media.toFixed(1),
      notaMaxima: notaMaxima.toFixed(1),
      notaMinima: notaMinima.toFixed(1),
      aprovados,
      percentualAprovacao: percentualAprovacao.toFixed(1),
      totalAlunos: resultadosAgrupados.length,
    };
  };

  const exportarRelatorio = () => {
    const stats = calcularEstatisticas();
    let conteudo = `RELATÓRIO DA PROVA\n`;
    conteudo += `=================\n\n`;
    conteudo += `Título: ${prova?.titulo}\n`;
    conteudo += `Disciplina: ${prova?.disciplina.nome}\n`;
    conteudo += `Professor: ${prova?.disciplina.professor.nome}\n`;
    conteudo += `Data: ${new Date(prova?.data || "").toLocaleDateString(
      "pt-BR"
    )}\n\n`;

    if (stats) {
      conteudo += `ESTATÍSTICAS GERAIS:\n`;
      conteudo += `====================\n`;
      conteudo += `Total de alunos: ${stats.totalAlunos}\n`;
      conteudo += `Média da turma: ${stats.media}\n`;
      conteudo += `Nota máxima: ${stats.notaMaxima}\n`;
      conteudo += `Nota mínima: ${stats.notaMinima}\n`;
      conteudo += `Aprovados (≥7.0): ${stats.aprovados}\n`;
      conteudo += `Percentual de aprovação: ${stats.percentualAprovacao}%\n\n`;
    }

    conteudo += `RESULTADOS INDIVIDUAIS:\n`;
    conteudo += `=======================\n`;

    resultadosAgrupados.forEach((aluno) => {
      conteudo += `\nAluno ID: ${aluno.idAluno}\n`;
      conteudo += `Nota: ${aluno.nota.toFixed(1)}/10.0\n`;
      conteudo += `Acertos: ${aluno.acertos}/${aluno.totalQuestoes}\n`;
      conteudo += `Desempenho: ${(
        (aluno.acertos / aluno.totalQuestoes) *
        100
      ).toFixed(1)}%\n`;

      conteudo += `Respostas:\n`;
      aluno.respostas.forEach((resposta) => {
        const questao = prova?.questoes.find(
          (q: any) => q.id === resposta.idQuestao
        );
        conteudo += `  Questão ${resposta.idQuestao}: ${resposta.resposta} - ${
          resposta.acertou ? "✅" : "❌"
        }\n`;
      });

      conteudo += `---\n`;
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
                <p className="text-sm text-gray-500">
                  Disciplina: {prova.disciplina.nome} - Professor:{" "}
                  {prova.disciplina.professor.nome}
                </p>
              </div>
            </div>
            {resultadosAgrupados.length > 0 && (
              <Button onClick={exportarRelatorio}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resultadosAgrupados.length === 0 ? (
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total de Alunos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalAlunos}
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
                      Nota Máxima
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.notaMaxima}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Nota Mínima
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {stats.notaMinima}
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
                  Resultados Individuais por Aluno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resultadosAgrupados.map((aluno) => (
                    <div key={aluno.idAluno} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">
                          Aluno ID: {aluno.idAluno}
                        </h3>
                        <div className="text-right">
                          <span
                            className={`text-lg font-bold ${
                              aluno.nota >= 7
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {aluno.nota.toFixed(1)}/10.0
                          </span>
                          <p className="text-sm text-gray-500">
                            {aluno.acertos}/{aluno.totalQuestoes} acertos
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {aluno.respostas.map((resposta, index) => {
                          const questao = prova.questoes.find(
                            (q: any) => q.id === resposta.idQuestao
                          );
                          return (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm"
                            >
                              <span>Questão {resposta.idQuestao}:</span>
                              <span
                                className={
                                  resposta.acertou
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {resposta.resposta}{" "}
                                {resposta.acertou ? "✅" : "❌"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

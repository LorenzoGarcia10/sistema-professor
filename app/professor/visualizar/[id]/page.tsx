"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetProva } from "@/lib/useGetProva";

export default function VisualizarProvaPage() {
  const router = useRouter();
  const params = useParams();
  const [questaoAtual, setQuestaoAtual] = useState(0);

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

  if (loading) return <p className="text-center mt-8">Carregando prova...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;
  if (!prova) return <p className="text-center mt-8">Prova não encontrada.</p>;

  const questao = prova.questoes[questaoAtual];
  const alternativas = [
    { letra: "A", texto: questao.alternativaA },
    { letra: "B", texto: questao.alternativaB },
    { letra: "C", texto: questao.alternativaC },
    { letra: "D", texto: questao.alternativaD },
    { letra: "E", texto: questao.alternativaE },
  ];

  const proximaQuestao = () => {
    if (questaoAtual < prova.questoes.length - 1) {
      setQuestaoAtual(questaoAtual + 1);
    }
  };

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1);
    }
  };

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
                  Visualizar Prova
                </h1>
                <p className="text-gray-600">{prova.titulo}</p>
                <p className="text-sm text-gray-500">
                  Disciplina: {prova.disciplina.nome}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Questão {questaoAtual + 1} de {prova.questoes.length}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações da Prova</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Título</p>
                <p className="font-medium">{prova.titulo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Disciplina</p>
                <p className="font-medium">{prova.disciplina.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-medium">
                  {new Date(prova.data).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Questões</p>
                <p className="font-medium">{prova.questoes.length}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Descrição</p>
                <p className="font-medium">{prova.descricao}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Questão {questaoAtual + 1}</span>
              <span className="text-sm font-normal text-green-600">
                Alternativa correta: {questao.alternativaCorreta}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-lg font-medium mb-4">{questao.descricao}</p>

              <div className="space-y-3">
                {alternativas.map((alternativa, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      alternativa.letra === questao.alternativaCorreta
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <p className="font-medium">
                      <span className="inline-block w-6 h-6 bg-gray-200 rounded-full text-center mr-2">
                        {alternativa.letra}
                      </span>
                      {alternativa.texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={questaoAnterior}
                disabled={questaoAtual === 0}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <div className="flex space-x-1">
                {prova.questoes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestaoAtual(index)}
                    className={`w-8 h-8 rounded-full ${
                      index === questaoAtual
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <Button
                onClick={proximaQuestao}
                disabled={questaoAtual === prova.questoes.length - 1}
                variant="outline"
              >
                Próxima
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useCriarProva } from "@/lib/useNovaProva";

interface Questao {
  id: string;
  pergunta: string;
  alternativas: string[];
  respostaCorreta: number;
}

export default function NovaProvaPage() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState({
    pergunta: "",
    alternativas: ["", "", "", "", ""],
    respostaCorreta: 0,
  });
  const [disciplinaId] = useState(1); // 🔹 Ajusta para pegar a disciplina certa
  const [data] = useState(new Date().toISOString().split("T")[0]); // pega data atual
  const router = useRouter();

  const { criarProva, loading, error, success } = useCriarProva();

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

  const adicionarQuestao = () => {
    if (
      !questaoAtual.pergunta.trim() ||
      questaoAtual.alternativas.some((alt) => !alt.trim())
    ) {
      alert("Preencha a pergunta e todas as alternativas");
      return;
    }

    const novaQuestao: Questao = {
      id: Date.now().toString(),
      pergunta: questaoAtual.pergunta.trim(),
      alternativas: questaoAtual.alternativas.map((alt) => alt.trim()),
      respostaCorreta: questaoAtual.respostaCorreta,
    };

    setQuestoes([...questoes, novaQuestao]);
    setQuestaoAtual({
      pergunta: "",
      alternativas: ["", "", "", "", ""],
      respostaCorreta: 0,
    });
  };

  const removerQuestao = (id: string) => {
    setQuestoes(questoes.filter((q) => q.id !== id));
  };

  const salvarProva = async () => {
    if (!titulo.trim() || !descricao.trim() || questoes.length === 0) {
      alert("Preencha todos os campos e adicione pelo menos uma questão");
      return;
    }

    // 🔹 Mapeando as questões para o formato que o backend espera
    const questoesFormatadas = questoes.map((q) => ({
      descricao: q.pergunta,
      alternativaCorreta: String.fromCharCode(65 + q.respostaCorreta),
      alternativaA: q.alternativas[0],
      alternativaB: q.alternativas[1],
      alternativaC: q.alternativas[2],
      alternativaD: q.alternativas[3],
      alternativaE: q.alternativas[4],
    }));

    const novaProva = {
      disciplinaId,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      data,
      questoes: questoesFormatadas,
    };

    const result = await criarProva(novaProva);

    if (result) {
      alert("Prova criada com sucesso!");
      router.push("/professor/dashboard");
    }
  };

  // Atualiza uma alternativa sem mutar o estado
  const updateAlternativa = (index: number, value: string) => {
    setQuestaoAtual((prev) => {
      const alternativas = [...prev.alternativas];
      alternativas[index] = value;
      return { ...prev, alternativas };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              onClick={() => router.push("/professor/dashboard")}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Nova Prova</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Informações da Prova */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Prova</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título da Prova</Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Prova de Matemática - 1º Bimestre"
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição da prova..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Adicionar Questão */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Questão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pergunta">Pergunta</Label>
                <Textarea
                  id="pergunta"
                  value={questaoAtual.pergunta}
                  onChange={(e) =>
                    setQuestaoAtual({
                      ...questaoAtual,
                      pergunta: e.target.value,
                    })
                  }
                  placeholder="Digite a pergunta..."
                />
              </div>

              <div className="space-y-3">
                <Label>Alternativas</Label>
                {questaoAtual.alternativas.map((alt, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <Input
                      value={alt}
                      onChange={(e) => updateAlternativa(index, e.target.value)}
                      placeholder={`Alternativa ${String.fromCharCode(
                        65 + index
                      )}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label>Resposta Correta</Label>
                <RadioGroup
                  value={questaoAtual.respostaCorreta.toString()}
                  onValueChange={(value) =>
                    setQuestaoAtual({
                      ...questaoAtual,
                      respostaCorreta: Number.parseInt(value),
                    })
                  }
                >
                  {questaoAtual.alternativas.map((alt, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`resp-${index}`}
                      />
                      <Label htmlFor={`resp-${index}`}>
                        {String.fromCharCode(65 + index)}){" "}
                        {alt ||
                          `Alternativa ${String.fromCharCode(65 + index)}`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button onClick={adicionarQuestao} className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Questão
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Questões */}
          {questoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questões Adicionadas ({questoes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questoes.map((questao, index) => (
                    <div key={questao.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Questão {index + 1}</h4>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removerQuestao(questao.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-700 mb-2">{questao.pergunta}</p>
                      <div className="space-y-1">
                        {questao.alternativas.map((alt, altIndex) => (
                          <p
                            key={altIndex}
                            className={`text-sm ${
                              altIndex === questao.respostaCorreta
                                ? "text-green-600 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {String.fromCharCode(65 + altIndex)}) {alt}
                            {altIndex === questao.respostaCorreta && " ✓"}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Salvar Prova */}
          <div className="flex flex-col items-center space-y-2">
            <Button onClick={salvarProva} size="lg" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Salvando..." : "Salvar Prova"}
            </Button>
            {error && <p className="text-red-600">{error}</p>}
            {success && (
              <p className="text-green-600">Prova criada com sucesso!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

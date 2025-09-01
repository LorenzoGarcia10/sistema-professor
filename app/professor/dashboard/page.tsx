"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Plus,
  FileText,
  BarChart3,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { useProvasProfessor } from "@/lib/useGetProvaProfessor";
import { useDeleteProva } from "@/lib/useDeleteProva";

export default function ProfessorDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const {
    provas,
    loading: loadingProvas,
    error: errorProvas,
    refetch,
  } = useProvasProfessor(user?.id || null);

  const {
    deleteProva,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteProva();

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

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleDeleteProva = async (provaId: number, provaTitulo: string) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir a prova "${provaTitulo}"? Esta ação não pode ser desfeita.`
      )
    ) {
      return;
    }

    const success = await deleteProva(provaId);
    if (success) {
      // Recarregar a lista de provas após exclusão
      refetch();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard do Professor
              </h1>
              <p className="text-gray-600">Bem-vindo, {user.name}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorDelete && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">Erro ao excluir: {errorDelete}</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Minhas Provas</h2>
            <Button onClick={() => router.push("/professor/nova-prova")}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Prova
            </Button>
          </div>

          {loadingProvas && (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="w-12 h-12 mx-auto text-gray-400 mb-4 animate-spin" />
                <p className="text-gray-600">Carregando provas...</p>
              </CardContent>
            </Card>
          )}

          {errorProvas && (
            <Card>
              <CardContent className="p-8 text-center text-red-500">
                <p>Erro ao carregar provas: {errorProvas}</p>
                <Button onClick={refetch} variant="outline" className="mt-2">
                  Tentar novamente
                </Button>
              </CardContent>
            </Card>
          )}

          {!loadingProvas && provas.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Você ainda não criou nenhuma prova.
                </p>
                <Button onClick={() => router.push("/professor/nova-prova")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Prova
                </Button>
              </CardContent>
            </Card>
          )}

          {!loadingProvas && provas.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {provas.map((prova) => (
                <Card
                  key={prova.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {prova.titulo}
                    </CardTitle>
                    <CardDescription>{prova.descricao}</CardDescription>
                    <CardDescription className="text-sm">
                      Disciplina: {prova.disciplina.nome}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Questões:</strong> {prova.questoes.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Data:</strong>{" "}
                        {new Date(prova.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/professor/visualizar/${prova.id}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/professor/relatorio/${prova.id}`)
                        }
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Relatório
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDeleteProva(prova.id, prova.titulo)
                        }
                        disabled={loadingDelete}
                      >
                        {loadingDelete ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { LogOut, Plus, FileText, BarChart3, Eye } from "lucide-react"

interface Prova {
  id: string
  titulo: string
  descricao: string
  questoes: any[]
  ativa: boolean
}

export default function ProfessorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [provas, setProvas] = useState<Prova[]>([])
  const router = useRouter()

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

    setUser(parsedUser)

    // Carregar provas
    const provasData = localStorage.getItem("provas")
    if (provasData) {
      setProvas(JSON.parse(provasData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const toggleProvaAtiva = (provaId: string) => {
    const novasProvas = provas.map((prova) => (prova.id === provaId ? { ...prova, ativa: !prova.ativa } : prova))
    setProvas(novasProvas)
    localStorage.setItem("provas", JSON.stringify(novasProvas))
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Professor</h1>
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Minhas Provas</h2>
            <Button onClick={() => router.push("/professor/nova-prova")}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Prova
            </Button>
          </div>

          {provas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Você ainda não criou nenhuma prova.</p>
                <Button onClick={() => router.push("/professor/nova-prova")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Prova
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {provas.map((prova) => (
                <Card key={prova.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {prova.titulo}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          prova.ativa ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {prova.ativa ? "Ativa" : "Inativa"}
                      </span>
                    </CardTitle>
                    <CardDescription>{prova.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Questões:</strong> {prova.questoes.length}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/professor/prova/${prova.id}`)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/professor/relatorio/${prova.id}`)}
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Relatório
                      </Button>
                      <Button
                        variant={prova.ativa ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleProvaAtiva(prova.id)}
                      >
                        {prova.ativa ? "Desativar" : "Ativar"}
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
  )
}

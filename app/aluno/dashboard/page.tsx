"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { LogOut, FileText, Clock, CheckCircle } from "lucide-react"

interface Prova {
  id: string
  titulo: string
  descricao: string
  questoes: any[]
  ativa: boolean
}

export default function AlunoDashboard() {
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
    if (parsedUser.userType !== "aluno") {
      router.push("/")
      return
    }

    setUser(parsedUser)

    // Carregar provas disponíveis
    const provasData = localStorage.getItem("provas")
    if (provasData) {
      const todasProvas = JSON.parse(provasData)
      setProvas(todasProvas.filter((prova: Prova) => prova.ativa))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const iniciarProva = (provaId: string) => {
    router.push(`/aluno/prova/${provaId}`)
  }

  const jaFezProva = (provaId: string) => {
    const resultados = localStorage.getItem("resultados")
    if (!resultados) return false

    const parsedResultados = JSON.parse(resultados)
    return parsedResultados.some((r: any) => r.provaId === provaId && r.alunoEmail === user?.email)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Aluno</h1>
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
          <h2 className="text-xl font-semibold mb-4">Provas Disponíveis</h2>

          {provas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Nenhuma prova disponível no momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {provas.map((prova) => (
                <Card key={prova.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {prova.titulo}
                      {jaFezProva(prova.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-500" />
                      )}
                    </CardTitle>
                    <CardDescription>{prova.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Questões:</strong> {prova.questoes.length}
                      </p>
                    </div>

                    {jaFezProva(prova.id) ? (
                      <Button disabled className="w-full">
                        Prova já realizada
                      </Button>
                    ) : (
                      <Button onClick={() => iniciarProva(prova.id)} className="w-full">
                        Iniciar Prova
                      </Button>
                    )}
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

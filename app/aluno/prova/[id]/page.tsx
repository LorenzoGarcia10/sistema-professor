"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"

interface Questao {
  id: string
  pergunta: string
  alternativas: string[]
  respostaCorreta: number
}

interface Prova {
  id: string
  titulo: string
  descricao: string
  questoes: Questao[]
}

export default function ProvaPage() {
  const [prova, setProva] = useState<Prova | null>(null)
  const [respostas, setRespostas] = useState<{ [key: string]: number }>({})
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Carregar prova específica
    const provasData = localStorage.getItem("provas")
    if (provasData) {
      const provas = JSON.parse(provasData)
      const provaEncontrada = provas.find((p: Prova) => p.id === params.id)
      if (provaEncontrada) {
        setProva(provaEncontrada)
      } else {
        router.push("/aluno/dashboard")
      }
    }
  }, [params.id, router])

  const handleRespostaChange = (questaoId: string, alternativa: number) => {
    setRespostas((prev) => ({
      ...prev,
      [questaoId]: alternativa,
    }))
  }

  const finalizarProva = () => {
    if (!prova || !user) return

    // Calcular nota
    let acertos = 0
    prova.questoes.forEach((questao) => {
      if (respostas[questao.id] === questao.respostaCorreta) {
        acertos++
      }
    })

    const nota = (acertos / prova.questoes.length) * 10

    // Salvar resultado
    const resultados = JSON.parse(localStorage.getItem("resultados") || "[]")
    const novoResultado = {
      provaId: prova.id,
      alunoEmail: user.email,
      alunoNome: user.name,
      nota: nota.toFixed(1),
      acertos,
      totalQuestoes: prova.questoes.length,
      data: new Date().toISOString(),
    }

    resultados.push(novoResultado)
    localStorage.setItem("resultados", JSON.stringify(resultados))

    // Redirecionar com resultado
    router.push(`/aluno/resultado?nota=${nota.toFixed(1)}&acertos=${acertos}&total=${prova.questoes.length}`)
  }

  const todasQuestoesRespondidas = prova?.questoes.every((q) => respostas[q.id] !== undefined)

  if (!prova) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button onClick={() => router.push("/aluno/dashboard")} variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{prova.titulo}</h1>
              <p className="text-gray-600">{prova.descricao}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {prova.questoes.map((questao, index) => (
            <Card key={questao.id}>
              <CardHeader>
                <CardTitle className="text-lg">Questão {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-800 font-medium">{questao.pergunta}</p>

                  <RadioGroup
                    value={respostas[questao.id]?.toString()}
                    onValueChange={(value) => handleRespostaChange(questao.id, Number.parseInt(value))}
                  >
                    {questao.alternativas.map((alternativa, altIndex) => (
                      <div key={altIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={altIndex.toString()} id={`${questao.id}-${altIndex}`} />
                        <Label htmlFor={`${questao.id}-${altIndex}`} className="cursor-pointer flex-1">
                          {String.fromCharCode(65 + altIndex)}) {alternativa}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center pt-6">
            <Button onClick={finalizarProva} disabled={!todasQuestoesRespondidas} size="lg">
              <Send className="w-4 h-4 mr-2" />
              Finalizar Prova
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

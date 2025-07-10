"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Home } from "lucide-react"

export default function ResultadoPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const nota = searchParams.get("nota")
  const acertos = searchParams.get("acertos")
  const total = searchParams.get("total")

  const notaNum = Number.parseFloat(nota || "0")
  const corNota = notaNum >= 7 ? "text-green-600" : notaNum >= 5 ? "text-yellow-600" : "text-red-600"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Prova Finalizada!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-gray-600">Sua nota:</p>
            <p className={`text-4xl font-bold ${corNota}`}>{nota}</p>
          </div>

          <div className="space-y-1">
            <p className="text-gray-600">
              Você acertou <strong>{acertos}</strong> de <strong>{total}</strong> questões
            </p>
            <p className="text-sm text-gray-500">
              {notaNum >= 7 ? "Parabéns! Excelente resultado!" : notaNum >= 5 ? "Bom trabalho!" : "Continue estudando!"}
            </p>
          </div>

          <Button onClick={() => router.push("/aluno/dashboard")} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

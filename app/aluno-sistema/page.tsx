"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft } from "lucide-react"

export default function AlunoRedirect() {
  useEffect(() => {
    // Em produção, este seria o domínio do sistema de alunos
    // window.location.href = 'https://alunos.escola.com'
  }, [])

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">Sistema de Alunos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-100 p-6 rounded-lg">
            <ExternalLink className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <p className="text-gray-700 mb-4">Você seria redirecionado para o sistema específico de alunos em:</p>
            <code className="bg-white px-3 py-1 rounded text-sm">https://alunos.escola.com</code>
          </div>

          <div className="text-left space-y-2 text-sm text-gray-600">
            <p>
              <strong>Funcionalidades do Sistema de Alunos:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Dashboard personalizado</li>
              <li>Lista de provas disponíveis</li>
              <li>Interface para realizar provas</li>
              <li>Histórico de resultados</li>
              <li>Perfil do estudante</li>
            </ul>
          </div>

          <Button onClick={() => window.history.back()} variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

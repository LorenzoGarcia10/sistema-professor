"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft } from "lucide-react"

export default function ProfessorRedirect() {
  useEffect(() => {
    // Em produção, este seria o domínio do sistema de professores
    // window.location.href = 'https://professores.escola.com'
  }, [])

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-green-600">Sistema de Professores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-100 p-6 rounded-lg">
            <ExternalLink className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <p className="text-gray-700 mb-4">Você seria redirecionado para o sistema específico de professores em:</p>
            <code className="bg-white px-3 py-1 rounded text-sm">https://professores.escola.com</code>
          </div>

          <div className="text-left space-y-2 text-sm text-gray-600">
            <p>
              <strong>Funcionalidades do Sistema de Professores:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Dashboard administrativo</li>
              <li>Criação e edição de provas</li>
              <li>Gerenciamento de questões</li>
              <li>Relatórios e estatísticas</li>
              <li>Controle de turmas</li>
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

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GraduationCap, Users, BookOpen } from "lucide-react";
import useLogin from "@/lib/useLogin";
import { useRouter } from "next/navigation";
import { getUsuarioFromToken } from "@/lib/tokenUtils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("aluno");
  const [isLoading, setIsLoading] = useState(false);

  const { login, error } = useLogin();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login({ login: email, senha: password });

      if (result && result.token) {
        localStorage.setItem("token", result.token);

        // Decodifica o token para obter os dados do usuário
        const usuarioFromToken = getUsuarioFromToken(result.token);

        console.log("Dados decodificados do token:", usuarioFromToken);

        if (usuarioFromToken) {
          // Usa os dados do token - baseado na estrutura do token
          const userData = {
            id: usuarioFromToken.id, // ← ID do usuário (campo "user" no token)
            email: usuarioFromToken.email, // ← Email do campo "sub"
            name: usuarioFromToken.name || email.split("@")[0], // Nome baseado no email
            userType: userType,
          };
          localStorage.setItem("user", JSON.stringify(userData));

          console.log("Dados do usuário salvos:", userData);
        } else {
          // Fallback se não conseguir decodificar o token
          const userData = {
            id: Date.now(),
            email: email,
            name: email.split("@")[0],
            userType: userType,
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        alert("Login realizado com sucesso!");

        // Redireciona para o dashboard correto baseado no tipo de usuário
        if (userType === "aluno") {
          router.push("/aluno/dashboard");
        } else if (userType === "professor") {
          router.push("/professor/dashboard");
        }
      } else {
        alert("Login falhou. Verifique suas credenciais.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Lado esquerdo - Informações */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Sistema Escolar
            </h1>
            <p className="text-xl text-gray-600">
              Plataforma integrada de ensino e aprendizagem
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Para Alunos</h3>
                <p className="text-gray-600">
                  Acesse suas provas, veja resultados e acompanhe seu progresso
                  acadêmico
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Para Professores
                </h3>
                <p className="text-gray-600">
                  Crie provas, gerencie questões e acompanhe o desempenho da
                  turma
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário de Login */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Fazer Login</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Login</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Seu login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Tipo de usuário</Label>
                <RadioGroup value={userType} onValueChange={setUserType}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="aluno" id="aluno" />
                    <Label
                      htmlFor="aluno"
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                    >
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Aluno</div>
                        <div className="text-sm text-gray-500">
                          Fazer provas e ver resultados
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="professor" id="professor" />
                    <Label
                      htmlFor="professor"
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                    >
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Professor</div>
                        <div className="text-sm text-gray-500">
                          Criar provas e gerenciar turmas
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() =>
                    alert(
                      "Entre em contato com a administração para solicitar acesso."
                    )
                  }
                >
                  Solicitar acesso
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

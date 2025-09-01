"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface LoginPayload {
  login: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  dataCriacao: string;
  dataExpiracao: string;
}

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    payload: LoginPayload
  ): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/v1/auth/login",
        payload
      );
      return response.data;
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao fazer login.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

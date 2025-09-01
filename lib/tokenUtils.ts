// lib/tokenUtils.ts
export const getUsuarioFromToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Token Inválido");
    }

    const payload = atob(parts[1]);
    const decoded = JSON.parse(payload);

    console.log("Token decodificado:", decoded);

    // Retorna um objeto com os dados do usuário baseado na estrutura do token
    // Baseado no exemplo: { exp: 1756771104, iss: "auth-projeto-sd", sub: "emailaluno@email.com.br", user: 2 }
    return {
      id: decoded.user, // O ID está no campo "user"
      email: decoded.sub, // O email está no campo "sub"
      // Outros campos que podem estar disponíveis
      exp: decoded.exp,
      iss: decoded.iss,
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

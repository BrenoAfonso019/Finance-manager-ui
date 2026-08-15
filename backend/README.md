# Finance Manager - Arquitetura e Engenharia de Backend

Base de backend profissional construída em **C# / .NET 8**, desenhada para alta coesão e isolamento rígido de segurança seguindo práticas *Secure by Design*.

## 🏗️ Padrões e Arquitetura Aplicada
- **Clean Architecture & DDD:** O núcleo do software (`Domain`) possui independência total de frameworks. As entidades validam suas próprias regras de negócio (`Always Valid State`).
- **Entity Framework Core (Code-First):** Configurações extraídas de anotações via Fluent API no `DbContext`. Mapeamento preciso de tipos monetários utilizando `decimal(18,2)`.
- **Injeção de Dependência:** Desacoplamento estrutural orquestrado na camada `API` pelo `Program.cs`.

## 🛡️ Segurança e Proteção (OWASP Top 10)
1. **Autenticação JWT & Anti-IDOR (Tenancy Isolation):**
   - Todos os endpoints possuem trava de contexto. O `TransactionsController` extrai o ID do usuário diretamente do *Claim* criptográfico do Token (`User.FindFirst(ClaimTypes.NameIdentifier)`), garantindo que o usuário interaja estritamente com seus próprios dados.
2. **Rate Limiting Nativo:**
   - Implementado filtro *Fixed Window* limitando cada nó/usuário a um máximo de 100 requisições por minuto, mitigando ataques de Força Bruta e DDoS de baixa escala.
3. **Tratamento Global de Exceções:**
   - Utilização de `UseExceptionHandler` sobrescrevendo *stack traces* não tratados, garantindo que infraestrutura e conexões de DB nunca sejam vazadas ao cliente.
4. **Hardening HTTP e CORS:**
   - Headers adicionados diretamente no pipeline (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`) e políticas rígidas de CORS restringindo *Origins* de acesso.

## 🚀 Utilização e Scripts
Para inicializar corretamente a estrutura em seu ambiente `.NET`, acesse a pasta e execute o roteiro do arquivo `setup.sh`, o qual engloba os comandos de vinculação e instanciação de `classlibs` e a API.

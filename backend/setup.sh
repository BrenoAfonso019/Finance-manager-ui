#!/bin/bash
# Script de automação para inicializar a estrutura Clean Architecture em um ambiente com .NET SDK

echo "Inicializando a Solution FinanceManager..."

dotnet new sln -n FinanceManager

# Criação das Camadas (Projetos)
dotnet new classlib -n FinanceManager.Domain -o backend/FinanceManager.Domain
dotnet new classlib -n FinanceManager.Application -o backend/FinanceManager.Application
dotnet new classlib -n FinanceManager.Infrastructure -o backend/FinanceManager.Infrastructure
dotnet new webapi -n FinanceManager.API -o backend/FinanceManager.API

# Adição dos Projetos na Solution
dotnet sln FinanceManager.sln add backend/FinanceManager.Domain/FinanceManager.Domain.csproj
dotnet sln FinanceManager.sln add backend/FinanceManager.Application/FinanceManager.Application.csproj
dotnet sln FinanceManager.sln add backend/FinanceManager.Infrastructure/FinanceManager.Infrastructure.csproj
dotnet sln FinanceManager.sln add backend/FinanceManager.API/FinanceManager.API.csproj

# Configuração de Referências (Clean Architecture)
dotnet add backend/FinanceManager.Application/FinanceManager.Application.csproj reference backend/FinanceManager.Domain/FinanceManager.Domain.csproj
dotnet add backend/FinanceManager.Infrastructure/FinanceManager.Infrastructure.csproj reference backend/FinanceManager.Domain/FinanceManager.Domain.csproj
dotnet add backend/FinanceManager.API/FinanceManager.API.csproj reference backend/FinanceManager.Application/FinanceManager.Application.csproj
dotnet add backend/FinanceManager.API/FinanceManager.API.csproj reference backend/FinanceManager.Infrastructure/FinanceManager.Infrastructure.csproj

echo "Estrutura finalizada com sucesso!"

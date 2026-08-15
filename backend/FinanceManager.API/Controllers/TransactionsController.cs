using FinanceManager.Application.DTOs;
using FinanceManager.Domain.Entities;
using FinanceManager.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FinanceManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Bloqueia acessos não autenticados via JWT
public class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TransactionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim ?? Guid.Empty.ToString());
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto dto)
    {
        var userId = GetCurrentUserId();

        // Isolamento de Tenancy: Valida se a conta informada pertence exclusivamente ao usuário atual
        var accountExists = await _context.Accounts
            .AnyAsync(a => a.Id == dto.AccountId && a.UserId == userId);
            
        if (!accountExists)
            return Forbid(); // Mitigação IDOR

        var transaction = new Transaction(
            dto.Amount,
            dto.Description,
            dto.Date,
            dto.Type,
            dto.AccountId,
            dto.CategoryId,
            userId
        );

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, new { transaction.Id, transaction.Description });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransaction(Guid id)
    {
        var userId = GetCurrentUserId();
        
        // Garante que a transação retornada pertence ao usuário (Isolamento de Tenancy)
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null)
            return NotFound();

        return Ok(transaction);
    }

    [HttpGet]
    public async Task<IActionResult> ListTransactions([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetCurrentUserId();

        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new 
            {
                t.Id,
                t.Amount,
                t.Description,
                t.Date,
                t.Type
            })
            .ToListAsync();

        return Ok(transactions);
    }
}

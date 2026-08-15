using FinanceManager.Domain.Enums;

namespace FinanceManager.Application.DTOs;

public class CreateTransactionDto
{
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    public Guid AccountId { get; set; }
    public Guid CategoryId { get; set; }
}

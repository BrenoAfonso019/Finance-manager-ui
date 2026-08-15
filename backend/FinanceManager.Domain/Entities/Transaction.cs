using FinanceManager.Domain.Enums;

namespace FinanceManager.Domain.Entities;

public class Transaction : BaseEntity
{
    public decimal Amount { get; private set; }
    public string Description { get; private set; }
    public DateTime Date { get; private set; }
    public TransactionType Type { get; private set; }

    public Guid AccountId { get; private set; }
    public Account Account { get; private set; }

    public Guid CategoryId { get; private set; }
    public Category Category { get; private set; }

    // Isolamento de Tenancy por usuário
    public Guid UserId { get; private set; }
    public User User { get; private set; }

    protected Transaction() { }

    public Transaction(decimal amount, string description, DateTime date, TransactionType type, Guid accountId, Guid categoryId, Guid userId)
    {
        if (amount <= 0) 
            throw new ArgumentException("O valor da transação deve ser maior que zero.");

        Amount = amount;
        Description = description;
        Date = date;
        Type = type;
        AccountId = accountId;
        CategoryId = categoryId;
        UserId = userId;
    }
}

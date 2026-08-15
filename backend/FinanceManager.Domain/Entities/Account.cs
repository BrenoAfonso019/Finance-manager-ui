namespace FinanceManager.Domain.Entities;

public class Account : BaseEntity
{
    public string Name { get; private set; }
    public decimal Balance { get; private set; }
    public Guid UserId { get; private set; }
    public User User { get; private set; }

    protected Account() { }

    public Account(string name, decimal initialBalance, Guid userId)
    {
        Name = name;
        Balance = initialBalance;
        UserId = userId;
    }

    public void UpdateBalance(decimal amount)
    {
        Balance += amount;
        UpdatedAt = DateTime.UtcNow;
    }
}

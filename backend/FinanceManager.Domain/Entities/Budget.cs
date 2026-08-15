namespace FinanceManager.Domain.Entities;

public class Budget : BaseEntity
{
    public decimal LimitAmount { get; private set; }
    public int Month { get; private set; }
    public int Year { get; private set; }

    public Guid CategoryId { get; private set; }
    public Category Category { get; private set; }

    public Guid UserId { get; private set; }
    public User User { get; private set; }

    protected Budget() { }

    public Budget(decimal limitAmount, int month, int year, Guid categoryId, Guid userId)
    {
        LimitAmount = limitAmount;
        Month = month;
        Year = year;
        CategoryId = categoryId;
        UserId = userId;
    }
}

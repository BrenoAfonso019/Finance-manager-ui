namespace FinanceManager.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; private set; }
    public string HexColor { get; private set; }
    public Guid UserId { get; private set; }
    public User User { get; private set; }

    protected Category() { }

    public Category(string name, string hexColor, Guid userId)
    {
        Name = name;
        HexColor = hexColor;
        UserId = userId;
    }
}

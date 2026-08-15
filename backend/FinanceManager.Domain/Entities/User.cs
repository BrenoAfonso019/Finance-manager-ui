namespace FinanceManager.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }

    public IReadOnlyCollection<Account> Accounts => _accounts.AsReadOnly();
    private readonly List<Account> _accounts = new();

    protected User() { } // EF Core requer construtor sem parâmetros

    public User(string name, string email, string passwordHash)
    {
        Name = name;
        Email = email;
        PasswordHash = passwordHash;
    }
}

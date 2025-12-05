using PollingApp.Models.Entities;

namespace PollingApp.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task AddUserAsync(User user);
        Task<bool> SaveChangesAsync();
    }
}

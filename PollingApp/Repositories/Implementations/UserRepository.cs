using Microsoft.EntityFrameworkCore;
using PollingApp.Data;
using PollingApp.Models.Entities;
using PollingApp.Repositories.Interfaces;

namespace PollingApp.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext context;

        public UserRepository(AppDbContext ctxt)
        {
            context = ctxt;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task AddUserAsync(User user)
        {
            await context.Users.AddAsync(user);
        }


        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}

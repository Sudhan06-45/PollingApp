using Microsoft.EntityFrameworkCore;
using PollingApp.Data;
using PollingApp.Models.Entities;
using PollingApp.Repositories.Interfaces;

namespace PollingApp.Repositories.Implementations
{
    public class PollRepository : IPollRepository
    {
        private readonly AppDbContext context;

        public PollRepository(AppDbContext ctxt)
        {
            context = ctxt;
        }

        public async Task<Poll?> GetPollByIdAsync(int id)
        {
            return await context.Polls
                .Include(p => p.Options)
                .Include(p => p.Votes)
                    .ThenInclude(v => v.Option)   
                .Include(p => p.CreatedBy)
                .FirstOrDefaultAsync(p => p.Id == id);
        }


        public async Task<IEnumerable<Poll>> GetActivePollsAsync()
        {
            return await context.Polls
                .Include(p => p.Options)
                .Where(p => p.IsActive && p.ExpiresAt > DateTime.UtcNow)
                .AsNoTracking()
                .ToListAsync();
        }


        public async Task AddPollAsync(Poll poll)
        {
            await context.Polls.AddAsync(poll);
        }

        public async Task UpdatePollAsync(Poll poll)
        {
            context.Polls.Update(poll);
        }

        public async Task DeactivatePollAsync(int pollId)
        {
            var poll = await context.Polls.FindAsync(pollId);
            if (poll != null)
            {
                poll.IsActive = false;
            }
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}

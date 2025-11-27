using Microsoft.EntityFrameworkCore;
using PollingApp.Data;
using PollingApp.Models.Entities;
using PollingApp.Repositories.Interfaces;

namespace PollingApp.Repositories.Implementations
{
    public class VoteRepository : IVoteRepository
    {
        private readonly AppDbContext context;

        public VoteRepository(AppDbContext ctxt)
        {
            context = ctxt;
        }

        public async Task<Vote?> GetActiveVoteAsync(int pollId, int userId)
        {
            return await context.Votes
                .FirstOrDefaultAsync(v =>
                    v.PollId == pollId &&
                    v.UserId == userId &&
                    v.IsActive);
        }

        public async Task AddVoteAsync(Vote vote)
        {
            await context.Votes.AddAsync(vote);
        }

        public async Task<IEnumerable<Vote>> GetVotesForPollAsync(int pollId)
        {
            return await context.Votes
                .Where(v => v.PollId == pollId && v.IsActive)
                .ToListAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}

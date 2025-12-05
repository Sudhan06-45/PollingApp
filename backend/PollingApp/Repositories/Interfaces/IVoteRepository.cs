using PollingApp.Models.Entities;

namespace PollingApp.Repositories.Interfaces
{
    public interface IVoteRepository
    {
        Task<Vote?> GetActiveVoteAsync(int pollId, int userId);
        Task AddVoteAsync(Vote vote);
        Task<IEnumerable<Vote>> GetVotesForPollAsync(int pollId);
        Task<bool> SaveChangesAsync();
    }
}

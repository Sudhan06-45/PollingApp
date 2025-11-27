using PollingApp.Models.Entities;

namespace PollingApp.Repositories.Interfaces
{
    public interface IPollRepository
    {
        Task<Poll?> GetPollByIdAsync(int id);
        Task<IEnumerable<Poll>> GetActivePollsAsync();
        Task AddPollAsync(Poll poll);
        Task UpdatePollAsync(Poll poll);
        Task DeactivatePollAsync(int pollId);
        Task<bool> SaveChangesAsync();
    }
}

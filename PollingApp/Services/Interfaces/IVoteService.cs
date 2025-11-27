using PollingApp.DTOs.Votes;

namespace PollingApp.Services.Interfaces
{
    public interface IVoteService
    {
        Task CastVoteAsync(int pollId, int userId, VoteRequestDto dto);
        Task<IEnumerable<VoteResultDto>> GetResultsAsync(int pollId);
        Task<MyVoteDto> GetMyVoteAsync(int pollId, int userId);
    }
}

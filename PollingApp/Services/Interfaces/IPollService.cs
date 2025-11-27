using PollingApp.DTOs.Polls;

namespace PollingApp.Services.Interfaces
{
    public interface IPollService
    {
        Task<int> CreatePollAsync(CreatePollDto dto, int adminId);
        Task<PollResponseDto?> GetPollByIdAsync(int id);
        Task<IEnumerable<PollResponseDto>> GetActivePollsAsync();
        Task UpdatePollStatusAsync(int id, bool isActive);
    }
}

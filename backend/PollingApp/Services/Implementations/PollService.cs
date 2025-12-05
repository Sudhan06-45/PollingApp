using PollingApp.DTOs.Polls;
using PollingApp.Models.Entities;
using PollingApp.Repositories.Interfaces;
using PollingApp.Services.Interfaces;

namespace PollingApp.Services.Implementations
{
    public class PollService : IPollService
    {
        private readonly IPollRepository _pollRepo;

        public PollService(IPollRepository pollRepo)
        {
            _pollRepo = pollRepo;
        }

        public async Task<int> CreatePollAsync(CreatePollDto dto, int adminId)
        {
            if (dto.Options == null || dto.Options.Count < 2)
                throw new Exception("At least 2 poll options required.");

            var poll = new Poll
            {
                Title = dto.Title,
                Description = dto.Description,
                CreatedById = adminId,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = dto.ExpiresAt,
                IsActive = true,
                AllowMultipleVotes = dto.AllowMultipleVotes,
                Options = dto.Options.Select((text, index) => new PollOption
                {
                    OptionText = text,
                    OrderIndex = index
                }).ToList()
            };

            await _pollRepo.AddPollAsync(poll);
            await _pollRepo.SaveChangesAsync();

            return poll.Id;
        }

        public async Task<IEnumerable<PollResponseDto>> GetActivePollsAsync()
        {
            var polls = await _pollRepo.GetActivePollsAsync();

            return polls.Select(p => new PollResponseDto
            {
                PollId = p.Id,
                Title = p.Title,
                Description = p.Description,
                ExpiresAt = p.ExpiresAt,
                IsActive = p.IsActive,

                Options = p.Options?
                    .Select(o => new PollOptionDto
                    {
                        Id = o.Id,
                        OptionText = o.OptionText
                    })
                    .ToList() ?? new List<PollOptionDto>()
            })
            .ToList();
        }


        public async Task<PollResponseDto?> GetPollByIdAsync(int id)
        {
            var poll = await _pollRepo.GetPollByIdAsync(id);
            if (poll == null) return null;

            return new PollResponseDto
            {
                PollId = poll.Id,
                Title = poll.Title,
                Description = poll.Description,
                IsActive = poll.IsActive,
                ExpiresAt = poll.ExpiresAt,
                Options = poll.Options.Select(o => new PollOptionDto
                {
                    Id = o.Id,
                    OptionText = o.OptionText
                }).ToList()
            };
        }

        public async Task UpdatePollStatusAsync(int id, bool isActive)
        {
            var poll = await _pollRepo.GetPollByIdAsync(id)
                ?? throw new Exception("Poll not found");

            poll.IsActive = isActive;

            await _pollRepo.UpdatePollAsync(poll);
            await _pollRepo.SaveChangesAsync();
        }
    }
}

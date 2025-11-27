using PollingApp.DTOs.Votes;
using PollingApp.Models.Entities;
using PollingApp.Repositories.Interfaces;
using PollingApp.Services.Interfaces;

namespace PollingApp.Services.Implementations
{
    public class VoteService : IVoteService
    {
        private readonly IVoteRepository _voteRepo;
        private readonly IPollRepository _pollRepo;

        public VoteService(IVoteRepository voteRepo, IPollRepository pollRepo)
        {
            _voteRepo = voteRepo;
            _pollRepo = pollRepo;
        }

        public async Task CastVoteAsync(int pollId, int userId, VoteRequestDto dto)
        {
            var poll = await _pollRepo.GetPollByIdAsync(pollId)
                ?? throw new Exception("Poll not found");

            if (!poll.IsActive || poll.ExpiresAt <= DateTime.UtcNow)
                throw new Exception("Poll expired");

            var existingVote = await _voteRepo.GetActiveVoteAsync(pollId, userId);
            if (existingVote != null)
                throw new Exception("User already voted");

            var vote = new Vote
            {
                PollId = pollId,
                UserId = userId,
                OptionId = dto.OptionId,
                VotedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _voteRepo.AddVoteAsync(vote);
            await _voteRepo.SaveChangesAsync();
        }

        public async Task<IEnumerable<VoteResultDto>> GetResultsAsync(int pollId)
        {
            var poll = await _pollRepo.GetPollByIdAsync(pollId)
                ?? throw new Exception("Poll not found");

            var votes = poll.Votes.Where(v => v.IsActive).ToList();
            var totalVotes = votes.Count;

            var results = poll.Options
                .Select(o => new VoteResultDto
                {
                    OptionId = o.Id,
                    OptionText = o.OptionText,
                    VoteCount = votes.Count(v => v.OptionId == o.Id),
                    Percentage = totalVotes == 0
                        ? 0
                        : Math.Round((double)votes.Count(v => v.OptionId == o.Id) / totalVotes * 100, 2)
                })
                .ToList();

            return results;
        }

        public async Task<MyVoteDto> GetMyVoteAsync(int pollId, int userId)
        {
            var poll = await _pollRepo.GetPollByIdAsync(pollId)
                ?? throw new Exception("Poll not found");

            var vote = poll.Votes.FirstOrDefault(v =>
                v.PollId == pollId &&
                v.UserId == userId &&
                v.IsActive);

            if (vote == null)
                return new MyVoteDto { OptionId = null, OptionText = "No vote cast" };

            var option = poll.Options.First(o => o.Id == vote.OptionId);

            return new MyVoteDto
            {
                OptionId = option.Id,
                OptionText = option.OptionText
            };
        }
    }
}

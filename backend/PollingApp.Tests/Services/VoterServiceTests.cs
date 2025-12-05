
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using PollingApp.Services.Implementations;
using PollingApp.Repositories.Interfaces;
using PollingApp.Models.Entities;
using PollingApp.DTOs.Votes;

namespace PollingApp.Tests.Services
{
    public class VoteServiceTests
    {
        private readonly Mock<IVoteRepository> _mockVoteRepo;
        private readonly Mock<IPollRepository> _mockPollRepo;
        private readonly VoteService _voteService;

        public VoteServiceTests()
        {
            _mockVoteRepo = new Mock<IVoteRepository>();
            _mockPollRepo = new Mock<IPollRepository>();
            _voteService = new VoteService(_mockVoteRepo.Object, _mockPollRepo.Object);
        }

        [Fact]
        public async Task CastVote_ShouldThrow_WhenPollNotFound()
        {
            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync((Poll?)null);

            await Assert.ThrowsAsync<Exception>(() =>
                _voteService.CastVoteAsync(1, userId: 10, new VoteRequestDto { OptionId = 5 })
            );
        }

        [Fact]
        public async Task CastVote_ShouldThrow_WhenPollExpired()
        {
            var poll = new Poll
            {
                Id = 1,
                IsActive = true,
                ExpiresAt = DateTime.UtcNow.AddMinutes(-1)
            };

            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync(poll);

            await Assert.ThrowsAsync<Exception>(() =>
                _voteService.CastVoteAsync(1, 5, new VoteRequestDto { OptionId = 100 })
            );
        }

        [Fact]
        public async Task CastVote_ShouldThrow_WhenUserAlreadyVoted()
        {
            var poll = new Poll
            {
                Id = 1,
                IsActive = true,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10)
            };

            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync(poll);

            _mockVoteRepo.Setup(r => r.GetActiveVoteAsync(1, 10))
                .ReturnsAsync(new Vote());

            await Assert.ThrowsAsync<Exception>(() =>
                _voteService.CastVoteAsync(1, 10, new VoteRequestDto { OptionId = 5 })
            );
        }

        [Fact]
        public async Task CastVote_ShouldSaveVote_WhenValid()
        {
            var poll = new Poll
            {
                Id = 1,
                IsActive = true,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10)
            };

            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync(poll);

            _mockVoteRepo.Setup(r => r.GetActiveVoteAsync(1, 50))
                .ReturnsAsync((Vote?)null);

            _mockVoteRepo.Setup(r => r.AddVoteAsync(It.IsAny<Vote>()))
                .Returns(Task.CompletedTask);

            _mockVoteRepo.Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(true);

            var dto = new VoteRequestDto { OptionId = 999 };

            await _voteService.CastVoteAsync(1, 50, dto);

            _mockVoteRepo.Verify(r => r.AddVoteAsync(It.Is<Vote>(v =>
                v.PollId == 1 &&
                v.UserId == 50 &&
                v.OptionId == 999
            )), Times.Once);

            _mockVoteRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetResults_ShouldThrow_WhenPollNotFound()
        {
            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync((Poll?)null);

            await Assert.ThrowsAsync<Exception>(() =>
                _voteService.GetResultsAsync(1)
            );
        }

        [Fact]
        public async Task GetResults_ShouldReturnCorrectPercentages()
        {
            var poll = new Poll
            {
                Id = 1,
                Options = new List<PollOption>
                {
                    new PollOption { Id = 10, OptionText = "A" },
                    new PollOption { Id = 20, OptionText = "B" }
                },
                Votes = new List<Vote>
                {
                    new Vote { OptionId = 10, IsActive = true },
                    new Vote { OptionId = 10, IsActive = true },
                    new Vote { OptionId = 20, IsActive = true }
                }
            };

            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync(poll);

            var results = (await _voteService.GetResultsAsync(1)).ToList();

            Assert.Equal(2, results.Count);

            Assert.Equal(10, results[0].OptionId);
            Assert.Equal(66.67, results[0].Percentage);

            Assert.Equal(20, results[1].OptionId);
            Assert.Equal(33.33, results[1].Percentage);
        }

        [Fact]
        public async Task GetMyVote_ShouldThrow_WhenPollNotFound()
        {
            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync((Poll?)null);

            await Assert.ThrowsAsync<Exception>(() =>
                _voteService.GetMyVoteAsync(1, 5)
            );
        }

        [Fact]
        public async Task GetMyVote_ShouldReturn_NoVote_WhenUserDidNotVote()
        {
            var poll = new Poll
            {
                Id = 1,
                Options = new List<PollOption>(),
                Votes = new List<Vote>()
            };

            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync(poll);

            var result = await _voteService.GetMyVoteAsync(1, 10);

            Assert.Null(result.OptionId);
            Assert.Equal("No vote cast", result.OptionText);
        }

        [Fact]
        public async Task GetMyVote_ShouldReturn_UserVote_WhenExists()
        {
            var poll = new Poll
            {
                Id = 1,
                Options = new List<PollOption>
                {
                    new PollOption { Id = 5, OptionText = "Option-X" }
                },
                Votes = new List<Vote>
                {
                    new Vote
                    {
                        PollId = 1,
                        UserId = 99,
                        OptionId = 5,
                        IsActive = true
                    }
                }
            };

            _mockPollRepo.Setup(r => r.GetPollByIdAsync(1))
                .ReturnsAsync(poll);

            var result = await _voteService.GetMyVoteAsync(1, 99);

            Assert.Equal(5, result.OptionId);
            Assert.Equal("Option-X", result.OptionText);
        }
    }
}

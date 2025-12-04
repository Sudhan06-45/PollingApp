using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using PollingApp.Services.Implementations;
using PollingApp.Repositories.Interfaces;
using PollingApp.Models.Entities;
using PollingApp.DTOs.Polls;

namespace PollingApp.Tests.Services
{
    public class PollServiceTests
    {
        private readonly Mock<IPollRepository> _mockPollRepo;
        private readonly PollService _pollService;

        public PollServiceTests()
        {
            _mockPollRepo = new Mock<IPollRepository>();
            _pollService = new PollService(_mockPollRepo.Object);
        }

        [Fact]
        public async Task CreatePoll_Should_Throw_When_Options_Less_Than_2()
        {

            var dto = new CreatePollDto
            {
                Title = "Test Poll",
                Description = "Desc",
                ExpiresAt = DateTime.UtcNow.AddDays(1),
                AllowMultipleVotes = false,
                Options = new List<string> { "OnlyOne" }
            };

            await Assert.ThrowsAsync<Exception>(() =>
                _pollService.CreatePollAsync(dto, adminId: 1)
            );
        }

        [Fact]
        public async Task CreatePoll_Should_SavePoll_And_ReturnPollId()
        {

            var dto = new CreatePollDto
            {
                Title = "New Poll",
                Description = "Test Poll",
                ExpiresAt = DateTime.UtcNow.AddDays(2),
                AllowMultipleVotes = true,
                Options = new List<string> { "A", "B", "C" }
            };

            // Mock AddPollAsync to assign ID
            _mockPollRepo.Setup(r => r.AddPollAsync(It.IsAny<Poll>()))
                .Callback<Poll>(p => p.Id = 10)
                .Returns(Task.CompletedTask);

            _mockPollRepo.Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(true);

            var pollId = await _pollService.CreatePollAsync(dto, adminId: 5);

            Assert.Equal(10, pollId);

            _mockPollRepo.Verify(r => r.AddPollAsync(It.IsAny<Poll>()), Times.Once);
            _mockPollRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetActivePolls_Should_ReturnMappedDtos()
        {

            var polls = new List<Poll>
            {
                new Poll
                {
                    Id = 1,
                    Title = "Poll 1",
                    Description = "Desc 1",
                    ExpiresAt = DateTime.UtcNow.AddDays(1),
                    IsActive = true,
                    Options = new List<PollOption>
                    {
                        new PollOption { Id = 101, OptionText = "A" }
                    }
                }
            };

            _mockPollRepo.Setup(r => r.GetActivePollsAsync()).ReturnsAsync(polls);

            var result = await _pollService.GetActivePollsAsync();

            Assert.Single(result);
            Assert.Equal("Poll 1", result.First().Title);
            Assert.Equal(101, result.First().Options.First().Id);
        }

        [Fact]
        public async Task GetPollById_Should_ReturnNull_WhenNotFound()
        {
            _mockPollRepo.Setup(r => r.GetPollByIdAsync(50))
                .ReturnsAsync((Poll?)null);

            var result = await _pollService.GetPollByIdAsync(50);

            Assert.Null(result);
        }

        [Fact]
        public async Task GetPollById_Should_ReturnMappedPollDto()
        {
            var poll = new Poll
            {
                Id = 3,
                Title = "Poll 3",
                Description = "Desc",
                IsActive = true,
                ExpiresAt = DateTime.UtcNow.AddDays(1),
                Options = new List<PollOption>
                {
                    new PollOption { Id = 12, OptionText = "X" },
                    new PollOption { Id = 13, OptionText = "Y" }
                }
            };

            _mockPollRepo.Setup(r => r.GetPollByIdAsync(3))
                .ReturnsAsync(poll);

            var result = await _pollService.GetPollByIdAsync(3);

            Assert.NotNull(result);
            Assert.Equal("Poll 3", result.Title);
            Assert.Equal(2, result.Options.Count);
        }

        [Fact]
        public async Task UpdatePollStatus_Should_Throw_WhenPollNotFound()
        {
      
            _mockPollRepo.Setup(r => r.GetPollByIdAsync(99))
                .ReturnsAsync((Poll?)null);

            await Assert.ThrowsAsync<Exception>(() =>
                _pollService.UpdatePollStatusAsync(99, false)
            );
        }

        [Fact]
        public async Task UpdatePollStatus_Should_SaveUpdatedPoll()
        {
            var poll = new Poll
            {
                Id = 8,
                IsActive = true
            };

            _mockPollRepo.Setup(r => r.GetPollByIdAsync(8))
                .ReturnsAsync(poll);

            _mockPollRepo.Setup(r => r.UpdatePollAsync(poll))
                .Returns(Task.CompletedTask);

            _mockPollRepo.Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(true);

            await _pollService.UpdatePollStatusAsync(8, false);

            Assert.False(poll.IsActive);

            _mockPollRepo.Verify(r => r.UpdatePollAsync(It.IsAny<Poll>()), Times.Once);
            _mockPollRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}

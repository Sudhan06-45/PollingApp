using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PollingApp.DTOs.Polls;
using PollingApp.Services.Interfaces;
using System.Security.Claims;

namespace PollingApp.Controllers
{
    [ApiController]
    [Route("api/polls")]
    public class PollsController : ControllerBase
    {
        private readonly IPollService _pollService;

        public PollsController(IPollService pollService)
        {
            _pollService = pollService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetActivePolls()
        {
            return Ok(await _pollService.GetActivePollsAsync());
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetPollById(int id)
        {
            var poll = await _pollService.GetPollByIdAsync(id);
            return poll == null ? NotFound() : Ok(poll);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreatePoll(CreatePollDto dto)
        {
            int adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            int pollId = await _pollService.CreatePollAsync(dto, adminId);

            return Ok(new { PollId = pollId, Message = "Poll is created successfully" });
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, UpdatePollStatusDto dto)
        {
            await _pollService.UpdatePollStatusAsync(id, dto.IsActive);
            return Ok(new { Message = "Poll status updated" });
        }
    }
}

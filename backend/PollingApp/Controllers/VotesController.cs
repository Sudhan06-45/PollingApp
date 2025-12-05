using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using PollingApp.DTOs.Votes;
using PollingApp.Services.Interfaces;

namespace PollingApp.Controllers
{
    [ApiController]
    [Route("api/polls/{pollId}/vote")]
    public class VotesController : ControllerBase
    {
        private readonly IVoteService _voteService;

        public VotesController(IVoteService voteService)
        {
            _voteService = voteService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CastVote(int pollId, VoteRequestDto dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _voteService.CastVoteAsync(pollId, userId, dto);
            return Ok(new { message = "Vote recorded successfully" });
        }

        [HttpGet("results")]
        [Authorize]
        public async Task<IActionResult> GetResults(int pollId)
        {
            return Ok(await _voteService.GetResultsAsync(pollId));
        }

        [HttpGet("my-vote")]
        [Authorize]
        public async Task<IActionResult> GetMyVote(int pollId)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            return Ok(await _voteService.GetMyVoteAsync(pollId, userId));
        }
    }
}

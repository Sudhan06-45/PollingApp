namespace PollingApp.DTOs.Polls
{
    public class PollResponseDto
    {
        public int PollId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; }
        public DateTime ExpiresAt { get; set; }

        public List<PollOptionDto> Options { get; set; } = new();
    }
}

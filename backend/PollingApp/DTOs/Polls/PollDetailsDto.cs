namespace PollingApp.DTOs.Polls
{
    public class PollDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsActive { get; set; }
        public bool AllowMultipleVotes { get; set; }
        public List<PollOptionDto> Options { get; set; } = new();
    }
}

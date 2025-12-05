namespace PollingApp.DTOs.Polls
{
    public class CreatePollDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool AllowMultipleVotes { get; set; } = false;

        public List<string> Options { get; set; } = new();
    }
}

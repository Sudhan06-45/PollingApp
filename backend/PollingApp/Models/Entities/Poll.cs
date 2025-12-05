namespace PollingApp.Models.Entities
{
    public class Poll
    {
        public int Id { get; set; }                 

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int CreatedById { get; set; }        

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime ExpiresAt { get; set; }

        public bool IsActive { get; set; } = true;

        public bool AllowMultipleVotes { get; set; } = false;

        public User? CreatedBy { get; set; }        

        public List<PollOption>? Options { get; set; }   

        public List<Vote>? Votes { get; set; }           
    }
}

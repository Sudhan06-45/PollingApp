namespace PollingApp.Models.Entities
{
    public class Vote
    {
        public int Id { get; set; }                
        public int PollId { get; set; }              
        public int OptionId { get; set; }            
        public int UserId { get; set; }             
        public DateTime VotedAt { get; set; } = DateTime.UtcNow;
        public string IpAddress { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;   
        public Poll? Poll { get; set; }
        public PollOption? Option { get; set; }
        public User? User { get; set; }
    }
}

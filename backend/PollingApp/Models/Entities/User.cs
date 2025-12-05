namespace PollingApp.Models.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash {  get; set; } = string.Empty;

        public string Role { get; set; } = "Voter";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
        
        //Below lines are the navigation properties which links to poll and vote entities
        public List<Poll>? PollsCreated { get; set; } 

        public List<Vote>? Votes { get; set; }
    }

}

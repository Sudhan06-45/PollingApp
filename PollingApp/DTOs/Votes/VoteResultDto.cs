namespace PollingApp.DTOs.Votes
{
    public class VoteResultDto
    {
        public int OptionId { get; set; }
        public string OptionText { get; set; } = string.Empty;
        public int VoteCount { get; set; }
        public double Percentage { get; set; }
    }
}

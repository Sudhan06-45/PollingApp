namespace PollingApp.Models.Entities
{
    public class PollOption
    {
        public int Id { get; set; }                 

        public int PollId { get; set; }             

        public string OptionText { get; set; } = string.Empty;

        public int OrderIndex { get; set; }         
        
        public Poll? Poll { get; set; }             

        public List<Vote>? Votes { get; set; }      
    }
}

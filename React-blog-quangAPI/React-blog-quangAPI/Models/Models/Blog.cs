using System.ComponentModel.DataAnnotations;

namespace React_blog_quangAPI.Data.Models
{
    public class Blog
    {
        [Key]
        public int Id { get; set; }

        public string? Name { get; set; }

        public bool? State { get; set; }

        public DateTime? Date { get; set; }

        public string? Note { get; set; }

        public string? Detail { get; set; }

        public int? IdType { get; set; }

        public virtual ICollection<BlogLocation>? BlogLocations { get; set; } = new List<BlogLocation>();

        public virtual Type? IdTypeNavigation { get; set; }
    }
}

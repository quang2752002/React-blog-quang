using System.ComponentModel.DataAnnotations;

namespace React_blog_quangAPI.Data.Models
{
    public class Location
    {
        [Key]
        public int Id { get; set; }

        public string? Name { get; set; }

        public virtual ICollection<BlogLocation>? BlogLocations { get; set; } = new List<BlogLocation>();
    }
}

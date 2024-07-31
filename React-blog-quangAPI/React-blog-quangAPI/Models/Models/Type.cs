using System.ComponentModel.DataAnnotations;

namespace React_blog_quangAPI.Data.Models
{
    public class Type
    {
        [Key]
        public int Id { get; set; }

        public string? Name { get; set; }

        public virtual ICollection<Blog>? Blogs { get; set; } = new List<Blog>();
    }
}

using System.ComponentModel.DataAnnotations;

namespace React_blog_quangAPI.Data.Models
{
    public class BlogLocation
    {
        [Key]
        public int Id { get; set; }

        public int? IdBlog { get; set; }

        public int? IdLocation { get; set; }

        public virtual Blog? IdBlogNavigation { get; set; }

        public virtual Location? IdLocationNavigation { get; set; }
    }
}

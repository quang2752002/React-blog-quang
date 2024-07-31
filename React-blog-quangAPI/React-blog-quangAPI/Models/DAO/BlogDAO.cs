using React_blog_quangAPI.Data.Models;
using React_blog_quangAPI.Models.VIEW;

namespace React_blog_quangAPI.Models.DAO
{
    public class BlogDAO
    {
        private BlogManagementContext context = new BlogManagementContext();
        public void InsertOrUpdate(Blog item)//Thêm mới và sửa 
        {
            if (item.Id == 0)
            {
                context.Blogs.Add(item);
            }
            context.SaveChanges();
        }
        public Blog getItem(int id)//tìm blog theo id
        {
            var query = context.Blogs.Where(x => x.Id == id).FirstOrDefault();

            return query;
        }
        public BlogVIEW getItemView(int id)//tìm blog theo id
        {
            var query = (from a in context.Blogs
                         join b in context.Types on a.IdType equals b.Id
                         where a.Id == id
                         select new BlogVIEW
                         {
                             Id = a.Id,
                             Name = a.Name ?? "",
                             Type = b.Name ?? "",
                             State = a.State ?? true,
                             Date = a.Date.Value,
                             Note = a.Note,
                             Detail = a.Detail,
                             IdType = a.IdType.Value,
                         }).FirstOrDefault();

            return query;
        }
        public List<BlogVIEW> Search(string name = "")// lấy toàn bộ dữ liệu và tìm kiếm theo tên blog
        {

            name ??= "";

            var query = from a in context.Blogs
                        join bl in context.BlogLocations on a.Id equals bl.IdBlog into blogLocations
                        from bl in blogLocations.DefaultIfEmpty()
                        join loc in context.Locations on bl.IdLocation equals loc.Id into locations
                        from loc in locations.DefaultIfEmpty()
                        join c in context.Types on a.IdType equals c.Id
                        select new BlogVIEW
                        {
                            Id = a.Id,
                            Name = a.Name,
                            Type = c.Name,
                            State = a.State.Value,
                            Date = a.Date.Value,
                            DateS = a.Date.Value.ToString("dd/MM/yyyy hh:mm"),
                            Location = loc != null ? loc.Name : "No Location"
                        };

            if (!string.IsNullOrEmpty(name))//tìm kiếm theo tên
            {
                query = query.Where(x => x.Name.Contains(name));
            }

            var resultList = query.ToList();

            var groupedQuery = resultList     //groupby
                                .GroupBy(x => x.Id)
                                .Select(g => new BlogVIEW
                                {
                                    Id = g.Key,
                                    Name = g.First().Name ?? "",
                                    Type = g.First().Type ?? "",
                                    State = g.First().State,
                                    Date = g.First().Date,
                                    DateS = g.First().DateS,
                                    Location = string.Join(", ", g.Select(x => x.Location).Distinct())
                                });

            return groupedQuery.ToList();
        }

        public void Delete(int id)// xóa blog
        {
            var blog = getItem(id);
            context.Blogs.Remove(blog);
            context.SaveChanges();
        }




    }
}

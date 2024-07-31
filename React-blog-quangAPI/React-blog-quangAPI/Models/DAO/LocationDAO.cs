using React_blog_quangAPI.Data.Models;
using React_blog_quangAPI.Models.VIEW;

namespace React_blog_quangAPI.Models.DAO
{
    public class LocationDAO
    {
        private BlogManagementContext context = new BlogManagementContext();
        public void InsertOrUpdate(Location item)// thêm mới và sửa 
        {
            if (item.Id == 0)
            {
                context.Locations.Add(item);
            }
            context.SaveChanges();
        }
        public Location getItem(int id)// tìm kiếm theo id
        {
            var query = context.Locations.Where(x => x.Id == id).FirstOrDefault();

            return query;
        }
        public LocationVIEW getItemView(int id)// tìm kiếm theo id
        {
            var query = (from a in context.Locations
                         where a.Id == id
                         select new LocationVIEW
                         {
                             Id = a.Id,
                             Name = a.Name ?? "",

                         }).FirstOrDefault();

            return query;
        }
        public List<LocationVIEW> Search(string name = "")//lấy toàn bộ và tìm kiếm theo tên
        {
            if (name == null) name = "";

            var query = (from a in context.Locations
                         select new LocationVIEW
                         {
                             Id = a.Id,
                             Name = a.Name ?? "",

                         });
            if (!string.IsNullOrEmpty(name) && name != "")
            {
                query = query.Where(x => x.Name.Contains(name));
            }

            return query.ToList();
        }
    }
}

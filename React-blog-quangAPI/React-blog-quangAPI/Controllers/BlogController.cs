using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using React_blog_quangAPI.Data.Models;
using React_blog_quangAPI.Models.DAO;

namespace React_blog_quangAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private const string IdBlog = "IdBlog";

        [HttpGet]
        [Route("getList")]
        public async Task<IActionResult> Showlist([FromQuery] string name = "")
        {
            BlogDAO blogDAO = new BlogDAO();

            // Search blogs based on the name query parameter
            var query = blogDAO.Search(name);

            return Ok(new { data = query });
        }


        [HttpGet("getBlog/{id}")]
        public async Task<IActionResult> getBlog(int id)// lấy thông tin blog 
        {
            BlogDAO blogDAO = new BlogDAO();
            BLogLocationDAO blogLocationDAO = new BLogLocationDAO();
            var query = blogDAO.getItemView(id);
            var listBlogLocations = blogLocationDAO.getByIdBlog(id);

            var arr = listBlogLocations.Select(loc => loc.IdLocation).ToList();//lây list id của location

            return Ok(new { data = query, arr = arr });
        }
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromForm] string name, [FromForm] int Idtype, [FromForm] bool state, [FromForm] int[] arr, [FromForm] DateTime date, [FromForm] string note, [FromForm] string detail)
        {
            if (string.IsNullOrWhiteSpace(name) || Idtype <= 0 || arr == null || arr.Length == 0 || date == default || string.IsNullOrWhiteSpace(note) || string.IsNullOrWhiteSpace(detail))
            {
                return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
            }

            try
            {
                BlogDAO blogDAO = new BlogDAO();
                BLogLocationDAO blogLocationDAO = new BLogLocationDAO();
                Blog blog = new Blog
                {
                    Name = name,
                    IdType = Idtype,
                    State = state,
                    Date = date,
                    Note = note,
                    Detail = detail
                };

                blogDAO.InsertOrUpdate(blog);

                if (blog.Id <= 0)
                {
                    return StatusCode(500, new { message = "Lỗi khi thêm blog." });
                }

                foreach (var locationId in arr)
                {
                    BlogLocation blogLocation = new BlogLocation
                    {
                        IdBlog = blog.Id,
                        IdLocation = locationId
                    };
                    blogLocationDAO.InsertOrUpdate(blogLocation);
                }

                return Ok(new { message = "Thêm mới thành công." });
            }
            catch (Exception ex)
            {
                // Log the exception details
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi thêm blog.", error = ex.Message });
            }
        }

        [HttpPatch]
        [Route("Update")]
        public async Task<IActionResult> Update([FromForm] int id, [FromForm] string name, [FromForm] int idType, [FromForm] bool state, [FromForm] string arr, [FromForm] DateTime date, [FromForm] string note, [FromForm] string detail)//chỉnh sửa  blog
        {
            
            BlogDAO blogDAO = new BlogDAO();
            BLogLocationDAO blogLocationDAO = new BLogLocationDAO();
            
            Blog blog = blogDAO.getItem(id);

            blog.Name = name;
            blog.IdType = idType;
            blog.State = state;
            blog.Date = date;
            blog.Note = note;
            blog.Detail = detail;
            blogDAO.InsertOrUpdate(blog);   //chỉnh sửa lại thông tin blog

            // lấy list id của location mà blog cập nhật
            if (arr == null) arr = "";
            List<int> locationIds = new List<int>();

            if (!string.IsNullOrEmpty(arr))
            {
                List<string> list = arr.Split('-').ToList();
                foreach (var item in list)
                {
                    if (!string.IsNullOrEmpty(item))
                    {
                        if (int.TryParse(item, out var result))
                        {
                            locationIds.Add(result);
                        }
                    }
                }
            }

            var query = blogLocationDAO.getByIdBlog(id);//lấy list blogLocation theo idBlog
            List<int> listIdBlogLocation = query.Select(loc => loc.Id).ToList();// lấy id 

            //xóa dữ liệu location cũ của blog
            foreach (var item in listIdBlogLocation)
            {
                blogLocationDAO.Delete(item);
            }

            // cập nhật lại location của blog dữ liệu mới
            foreach (var locationId in locationIds)
            {
                BlogLocation blogLocation = new BlogLocation
                {
                    IdBlog = blog.Id,
                    IdLocation = locationId
                };
                blogLocationDAO.InsertOrUpdate(blogLocation);
            }
            return Ok(new { mess = "Chỉnh sửa thành công" });
        }



        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)//hàm xóa blog
        {
            BlogDAO blogDAO = new BlogDAO();
            blogDAO.Delete(id);
            return Ok(new { mess = "xóa thành công " });

        }
        [HttpGet]
        [Route("getListLocation")]
        public async Task<IActionResult> listLocation() //list location
        {
            LocationDAO locationDAO = new LocationDAO();
            var query = locationDAO.Search();
            return Ok(new { data = query });

        }
       
        [HttpGet]
        [Route("getListType")]
        public async Task<IActionResult> getListType()
        {
            TypeDAO typeDAO = new TypeDAO();

          //  int id = HttpContext.Session.GetInt32(IdBlog) ?? 0;
            var listType = typeDAO.getList();          // danh sách type
           // var type = typeDAO.getItemByIdBlog(id);  // lấy type cần update
            return Ok(new { data = listType});
        }
    }
}

using Microsoft.EntityFrameworkCore;

namespace React_blog_quangAPI.Data.Models
{
    public class BlogManagementContext : DbContext
    {
        public BlogManagementContext()
        {

        }
        public BlogManagementContext(DbContextOptions options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                   .SetBasePath(Directory.GetCurrentDirectory())
                   .AddJsonFile("appsettings.json")
                   .Build();
                var connectionString = configuration.GetConnectionString("MyDB");
                optionsBuilder.UseSqlServer(connectionString);
            }
        }
        public virtual DbSet<Blog> Blogs { get; set; }
        public virtual DbSet<BlogLocation> BlogLocations { get; set; }
        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<Type> Types { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Blog>(entity =>
            {
                entity.ToTable("Blog");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name);

                entity.Property(e => e.State)
                        .HasColumnType("bit");

                entity.Property(e => e.Date)
                        .HasColumnType("datetime");


                entity.Property(e => e.Name);

                entity.Property(e => e.Note);

                entity.Property(e => e.Detail);
             

                entity.Property(e => e.IdType);

                entity.HasOne(d => d.IdTypeNavigation)
               .WithMany(p => p.Blogs)
               .HasForeignKey(p => p.IdType)
               .OnDelete(DeleteBehavior.SetNull);


            });
            modelBuilder.Entity<Location>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name);
            });
            modelBuilder.Entity<BlogLocation>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.IdBlog);


                entity.Property(e => e.IdLocation);
                 

                entity.HasOne(d => d.IdLocationNavigation)
                .WithMany(p => p.BlogLocations)
                .HasForeignKey(p => p.IdLocation)
                .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(d => d.IdBlogNavigation)
                .WithMany(p => p.BlogLocations)
                .HasForeignKey(p => p.IdBlog)
                .OnDelete(DeleteBehavior.SetNull);

            });

            modelBuilder.Entity<Type>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name);
            });
        }
    }
}

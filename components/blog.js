const BlogSection = () => {
  const blogs = [
    {
      id: 1,
      title: "Don't miss a single match this season.",
      description: "Whether it's an away...",
      image:
        "https://media.istockphoto.com/id/2097346937/photo/karate-training-kids-of-different-ages-in-kimono.jpg?s=1024x1024&w=is&k=20&c=w2ON0FP7b1ZpX63lOsiqqCmBfK-LR9CHmqqGxFMM8kQ=",
      author: "Michal",
      timeAgo: "1h ago",
    },
    {
      id: 2,
      title: "Game or international tournament",
      description: "Whether it's an away...",
      image:
        "https://media.istockphoto.com/id/508092196/photo/sport-karate-kids.jpg?s=1024x1024&w=is&k=20&c=BPHOQ1cQsNpXqs2N7QFx47oxofy64mN7rmgP4I6NSBU=",
      author: "Michal",
      timeAgo: "2h ago",
    },
    {
      id: 3,
      title: "Download to start streaming all major leagues",
      description: "Buffer-free...",
      image:
        "https://media.istockphoto.com/id/509622820/photo/little-boy-taking-karate.jpg?s=1024x1024&w=is&k=20&c=JGCsn4JmaGxF_qUSroV317YeeUKjDSERsc_-0DsK2Yk=",
      author: "Michal",
      timeAgo: "10 min ago",
    },
    {
      id: 4,
      title: "Mastering the Art of Kata",
      description:
        "Explore the precision and discipline of Kata, an essential aspect of karate training.",
      image:
        "https://media.istockphoto.com/id/178386235/photo/young-boy-practising-karate-outdoors.jpg?s=1024x1024&w=is&k=20&c=PP4baUNWVM49tLZ5idK3tkO8CMTZxucHJRDUblb-m6U=",
      author: "Michal",
      timeAgo: "1 day ago",
    },
    {
      id: 5,
      title: "Karate for Self-Defense",
      description:
        "Learn how karate provides not just physical strength, but also confidence and mental fortitude.",
      image:
        "https://media.istockphoto.com/id/547026946/photo/on-a-gray-background-little-athletes-in-karategi.jpg?s=1024x1024&w=is&k=20&c=whe5UIlDLsUIt8uvnLw2V7hk9WGYmGYBB5N5UARnZgU=",
      author: "Michal",
      timeAgo: "3 days ago",
    },
    {
      id: 6,
      title: "Kids and Karate: A Healthy Mix",
      description:
        "Discover the benefits of introducing your child to the world of karate, from physical fitness to life lessons in respect and perseverance.",
      image:
        "https://media.istockphoto.com/id/1756190054/photo/sensei-and-students-with-stacked-hands-in-a-judo-class-at-the-gym.jpg?s=1024x1024&w=is&k=20&c=eqI8phCpafkSC7FrwtOZ5YX9LBC2m6mcpg6a-94mfBQ=",
      author: "Michal",
      timeAgo: "1 week ago",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center my-10 tracking-wide text-gray-800">
        Recent Blogs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="relative bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 ease-in-out group overflow-hidden"
          >
            {/* Red Border using a Before Pseudo-element */}
            <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-red-500 transition-all duration-300 ease-in-out -z-10"></div>

            {/* Image Container */}
            <div className="h-48 w-full overflow-hidden rounded-t-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col h-auto">
              <h3
                className="font-semibold text-lg"
                style={{ color: "#E5287C" }}
              >
                {blog.title}
              </h3>
              <p className="text-gray-700 mt-2 mb-4">{blog.description}</p>
              <div className="text-gray-600 text-sm mt-auto">
                By {blog.author} | {blog.timeAgo}
              </div>
            </div>

            {/* Read more link at the bottom-right */}
            <a
              href="/blog"
              className="text-sm text-blue-500 hover:underline absolute bottom-4 right-4"
            >
              Read more...
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;

let data = {
  users: [
    {
      type: "admin",
      id: "7190581799",
      username: "admin",
      password: "admin",
      gender: "male",
      nickname: "Super Admin",
      avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
      mail: "coolguy@gmail.com",
      tel: "(647)-823-9988",
      numVisited: 1000,
      numHit: 2000,
      numPosts: 400,
      numUsers: 200
    },
    {
      type: "user",
      id: "0823170644",
      username: "user",
      password: "user",
      gender: "male",
      nickname: "Admin",
      follower: 10000,
      following: 23554,
      likes: "1.234m",
      banner: process.env.PUBLIC_URL + "./img/banner.jpg",
      avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
      numPosts: 5
    }
  ],
  posts: [
    {
      id: "19ibDhy5ft",
      author_id: "0823170644",
      title: "AWS Tutorial",
      category: "education",
      content:
        "Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides secure, resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers. Amazon EC2’s simple web service interface allows you to obtain and configure capacity with minimal friction. It provides you with complete control of your computing resources and lets you run on Amazon’s proven computing environment. Amazon EC2 reduces the time required to obtain and boot new server instances to minutes, allowing you to quickly scale capacity, both up and down, as your computing requirements change. Amazon EC2 changes the economics of computing by allowing you to pay only for capacity that you actually use. Amazon EC2 provides developers the tools to build failure resilient applications and isolate them from common failure scenarios.",
      likes: 25,
      likes_user_id: [],
      attachments: [
        "Nmx5b25eX2",
        "RXqqke6dhk",
        "GGKiDpennz",
        "llQMN8cVcp",
        "jecNnn6afM",
        "buOxLgpgw3",
        "Nj5yqBaRM0"
      ]
    },
    {
      id: "nIt38vzpz3",
      author_id: "0823170644",
      title: "Traveling in Vancouver",
      category: "travel",
      content:
        "Vancouver, a bustling west coast seaport in British Columbia, is among Canada’s densest, most ethnically diverse cities. A popular filming location, it’s surrounded by mountains, and also has thriving art, theatre and music scenes. Vancouver Art Gallery is known for its works by regional artists, while the Museum of Anthropology houses preeminent First Nations collections.",
      likes: 0,
      likes_user_id: [],
      attachments: []
    }
  ],
  comments: [
    {
      id: "FoiF2XhsMD",
      post_id: "post_id",
      user_id: "user_id",
      content: "content"
    },
    {
      id: "HY5A7zEt7K",
      post_id: "post_id",
      user_id: "user_id",
      content: "content"
    },
    {
      id: "sEiOyC3vX1",
      post_id: "post_id",
      user_id: "user_id",
      content: "content"
    },
    {
      id: "FiUpe9WCda",
      post_id: "post_id",
      user_id: "user_id",
      content: "content"
    },
    {
      id: "qdS5yUbenc",
      post_id: "post_id",
      user_id: "user_id",
      content: "content"
    },
    {
      id: "F8o7yrjoVe",
      post_id: "post_id",
      user_id: "user_id",
      content: "content"
    }
  ],
  attachments: [
    {
      id: "Nmx5b25eX2",
      post_id: "19ibDhy5ft",
      type: "youtube",
      content: "https://www.youtube.com/embed/dMVy3BQB314"
    },
    {
      id: "RXqqke6dhk",
      post_id: "19ibDhy5ft",
      type: "text",
      content:
        "Praesent et leo eget mauris imperdiet tempus. Maecenas id orci augue. In vel enim vel leo commodo placerat. Nulla sed commodo diam, a laoreet ipsum. Ut eu massa dictum, iaculis felis ac, dapibus sem. Integer ut velit mi. Phasellus in orci tellus. Morbi quis aliquam sapien, nec rhoncus odio. Curabitur pellentesque mi quis mauris consectetur, in faucibus libero fermentum. Praesent rhoncus metus ut ultricies interdum. Maecenas facilisis purus id sapien efficitur, accumsan dictum justo dapibus. In vitae congue nibh. Ut sollicitudin nulla mollis massa mattis iaculis."
    },
    {
      id: "GGKiDpennz",
      post_id: "19ibDhy5ft",
      type: "text",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac purus vitae orci congue bibendum ut sed velit. Duis nec sodales quam, sit amet sollicitudin nibh. Praesent faucibus tortor at faucibus maximus. In euismod nisi in tincidunt convallis. In non velit vitae ligula semper ornare vitae id odio. Integer cursus massa malesuada imperdiet pharetra. Fusce aliquam diam risus, eu vulputate velit auctor elementum."
    },
    {
      id: "llQMN8cVcp",
      post_id: "19ibDhy5ft",
      type: "image",
      content: "/img/SSL.png"
    },
    {
      id: "jecNnn6afM",
      post_id: "19ibDhy5ft",
      type: "pdf",
      content: "/files/AWS_Deploy_web_app_with_SSL.pdf"
    },
    {
      id: "buOxLgpgw3",
      post_id: "19ibDhy5ft",
      type: "text",
      content:
        "Nam interdum sapien et nibh eleifend scelerisque vitae eu mauris. Nulla facilisi. Nam eget neque vitae nunc dignissim semper. Curabitur sed gravida neque. Proin blandit semper mollis. Aenean egestas pulvinar sapien. Sed auctor, neque non consequat vulputate, neque turpis tincidunt sem, eu dictum ipsum metus at metus. Aenean accumsan lectus eu porttitor luctus. Etiam fringilla gravida fringilla. Phasellus in rhoncus ipsum. Mauris congue libero sed mollis tincidunt. Sed condimentum sapien ligula. Sed porttitor, nulla ac tristique suscipit, dui lectus porttitor est, ac vulputate urna mauris ut nibh. Curabitur quis quam orci. Donec et accumsan sapien."
    },
    {
      id: "Nj5yqBaRM0",
      post_id: "19ibDhy5ft",
      type: "image_link",
      content:
        "https://chiefit.me/wp-content/uploads/2019/06/Amazon-Web-Services_logo835x396.png"
    },
    {
      id: "jhgMjB4xlK",
      post_id: "nIt38vzpz3",
      type: "image",
      content: "/img/vancouver.jpg"
    },
    {
      id: "EZ6efFTSO6",
      post_id: "nIt38vzpz3",
      type: "image_link",
      content:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRICoMi_kc-1hJSBOY1ATUob1aqtdjpGYCoqHJKuDYWITaXnU5hpg&s"
    },
    {
      id: "pnfIHd0v3v",
      post_id: "nIt38vzpz3",
      type: "image_link",
      content:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4h84Mt3TwyV7s-snnF-HAxwU8wIIOhWglCwozAk1ogYLuSGCB&s"
    },
    {
      id: "enmKa0jv73",
      post_id: "nIt38vzpz3",
      type: "image_link",
      content:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb_i8jZRoNq2tXMZjqwdZZrrORb4wHPymGASKVD8Ir0TVejYqJ2w&s"
    },
    {
      id: "MepuIHM9JI",
      post_id: "nIt38vzpz3",
      type: "image_link",
      content:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPRTNxlDQ-o1chdtphOG0u29yoLjaF-YzLdURCsw3iVKa-28Ah&s"
    },
    {
      id: "4zLeQi9bkS",
      post_id: "nIt38vzpz3",
      type: "image_link",
      content:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPPZoB_48HCmGgK7gGntDUpUuUSCfSeQuwRvzNNjV3Uv0XChWmyg&s"
    },
    {
      id: "Q60IOtk26C",
      post_id: "nIt38vzpz3",
      type: "image_link",
      content:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQELT-zWsTKXApSU69guKDE9L6clELaJNj8rodNesngZV0SnfyS&s"
    }
  ],
  // current_user: "0823170644"
  current_user: undefined
  // current_post: undefined
};

export default data;

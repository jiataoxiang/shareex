let data = {
  users: [
    {
      id: "7190581799",
      username: "admin",
      password: "admin",
      gender: "male"
    },
    {
      id: "0823170644",
      username: "user",
      password: "user",
      gender: "male"
    }
  ],
  posts: [
    {
      id: "19ibDhy5ft",
      author_id: "0823170644",
      title: "title",
      category: "education",
      content: "content",
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
      title: "title",
      category: "travel",
      content: "content",
      attachments: []
    }
  ],
  comments: [],
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
      content: process.env.PUBLIC_URL + "/images/SSL.png"
    },
    {
      id: "jecNnn6afM",
      post_id: "19ibDhy5ft",
      type: "pdf",
      content: process.env.PUBLIC_URL + "/files/AWS_Deploy_web_app_with_SSL.pdf"
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
    }
  ],
  current_user: undefined,
  current_post: undefined
};

export default data;

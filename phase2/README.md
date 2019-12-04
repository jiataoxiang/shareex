# Phase2

## Deployment

https://shareex.huakunshen.com/

We rent our own server, configured it with a domain name and installed SSL certificate for security, thus the connection is via `https` protocol.

### Run the app

cd into phase2 folder

```
npm install
cd client npm install
npm start
cd ..
npm start
```

**users:**

| username | password |
| -------- | -------- |
| user     | user     |
| user2    | user2    |
| admin    | admin    |

## Connect db through shell

`mongo "mongodb+srv://shareex-36p7c.mongodb.net/test" --username dev`
password: `dev`

**Connect db with IDE:** `mongodb+srv://dev:dev@shareex-36p7c.mongodb.net/shareex?retryWrites=true&w=majority`

Cloudinary is used to store images and pdf

#### Home Page	`/`

All latest posts (limit to be 100) are displayed by default. 2 filters: category and sort by can be applied to find the posts you want. 

The search bar in the navbar can be used to search for posts and user by their title/username from anywhere in the app. After getting search results, you can still apply filters on those results.

Recommendations are filtered out from all posts, sorted by created time and number of views, intending to recommend the latest and most popular posts to user.

#### Post

On Home Page, posts are displayed in card form. User can like or dislike a post. Unlike is only allowed if the user has liked the post.

First 5 images in the post is displayed if there are any. You can click on the image and view the larger image. If description of the post is too long (longer than 500 characters), the description will be trimmed, complete post can only be read in single post page

Admin user can like or dislike a post as many times as he/she wants. Inappropriate posts can be deleted or hidden by admin. If a post is hidden, regular user can no longer see it. But admin can still see it and a `hidden` label is displayed for admin.

#### Navbar

Content in navbar are displayed based on authentication. e.g. `logout` only appears when user is logged in. 

#### Sign in & Sign up	`/login`, `/signup`

Passwords are all encrypted with bcrypt. User session is set to be 2 hours long, i.e. expired after 2 hours.

#### Create a new post. `/new_post`

After you log in to your account. You could click the `New Post` button in the navber. Users are required to provide information `Title` and `Content` fields. The `Category` field has default option: `Computer Science`. If user leave any of `Title` or `Content` fields empty, the post will not be allowed to submit. 

**Add attachments**

* User can choose to add text, image link, YouTube link, local image file and local PDF file by clicking the green `Add` button, and choose the attachment type in the dropdown menu.
* Each time a new attachment is added, a new green `Add` button will be added right below the item. This allows user to insert items at any position.
* Besides adding items, there is a red `Delete` button under each added attachments. User can delete the one they want.
* If user use the same uploader box to upload multiple numltiple links or local files, the new one will be stacked over the previous.
* After user click the blue `Submit` button located at the bottom right of the page. All data of this post will be added to the database.

**View a post**

* Click  `See Details` to go to the post.

#### Delete a post

User can delete a post by clicking into his/her post, and then click the red `Delete` button on the top of the post. Notice that only the author of the post can delete the post. Otherwise, the delete button will not be shown.

#### Edit a post	`/edit_post`

User can only edit his/her own post by clicking into the post he/she wants to modify, and click the green `Edit` button. This will direct user to the edit page. In the edit page, user can modify any parts of his/her post exactly like in the new post page. Click `Submit` after editing, and the modified post will be stored to database. Notice: a user will only be able to edit his/her own post.

#### Comment on a post

User can write comments on a post by clicking into the post and click `New Comment` button to write comments and click `Submit` to upload the comment. User can write multiple comments on other's and his/her own posts.

#### Edit & Delete a comment

A user will only be able to edit and delete his/her own comments on any posts.

#### Report a post

User can report a post by clicking `Report Post` button located on the right side of the post page. User is required provide report message/reasons. Otherwise, the report will not be performed.

#### Favourite a post

User can favorite a post of others' by clicking the `Favourite` button  located on the right side of the post page. After clicking this button, the button will become transparent, and it cannot be clicked again. Notice: user will not be able to report or favourite his/her own post.

## Overview of Routes

In the routes folder in `phase2`, there are all of our route files.

- attachments.js: `/api/attachments`
  - Create, delete attachments
- comments.js: `/api/comments`
  - Create, get, edit, delete comments
- index.js: `/`
  - Only used for testing if a server connection is successful
- notification.js: `/api/notifications`
- posts.js: `/api/posts`
  - Get, Create, edit, and delete posts
  - Change attributes of a post like number of views
- users.js: `/api/users`
  - Create user
  - login user
  - Patch (edit) user's attributes like passwords, view-history

There are too many routes, every route in these files has comments explaining their functions.

In middleware folder, auth.js includes some middleware functions. We add these middlewares to routes as needed to check if user if authenticated, authorized or is an admin.

#### User Profile `./userprofile`

Avatar: When you click upper half of avatar circle, animation will replace the banner, and it will be changed back if you click it again. If you click the lower half of the circle, you will be able to change your avatar (only support `.jpg`, `.jpeg`, `.png` file, but you will be warned if you choose other file).

Banner: When your mouse move over the banner, a changed banner button will drop down, and you will be able to change your banner.

Information: Display name, motto, email, number of post, number of follower, number of following, and edit button, you can change your information by clicking edit button.

options: (note: message board is not for communication, users leave comments here to describe this user)

when you click message board, you will be able to see all messages that other user send to you

when you click posts, you will be able to see all your posts sorted by time

when you click Favorites, you will be able to see all your favorite posts sorted by time

when you click View History, you will be able to see all the posts that you viewed sorted by time

when you click Follower Board, you will be able to see all the users you are following and all the users who follows you.

when you click Notification, you will be able to see notifications that sent by either admin or other users. You can search your notification, delete notification, and see detail, which direct you to other profile or single post (source of your notification)

#### Other profile: `./otherprofile/:id`

You can go to other profile by clicking icons whenever other users' avatar appear.

Information: Display name, motto, email, number of post, number of follower, number of following, you can follow a user by clicking follow button and then the button will be changed to unfollow button.  Under follow button, there is a report button, you can report a user by click report button, but you have to send reasonable message, when you report a user, a notification will be sent to all admin.

options:

when you click message board, you will be able to see all messages(comments) that other users describe this user, and you can also send message in other profile 

when you click post, you will be able to see all posts that owned by this user.

## Special features

- All pages support mobile device display. Elements on page are set to change depending on screen sizes.
- Dark and light theme: are remembered as user change it. In next login the same color theme is displayed for the user.
- Cascade delete, when a user is deleted, its avatar, banner images in cloudinary is also deleted, as well as its notifications, posts, and the posts' attachments, comments.
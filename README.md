# team21 Phase1 Report

### Team member

* Jiatao Xiang (xiangji5), git log name (Jiatao xiang, Jato xiang)
* Huakun Shen (shenhuak)
* Xu Wang
* Yuan Xu

# Instruction

Go into directory `phase1/react_app`,  run `npm start`, then you will be directed to our homepage.

The Web App has dark theme and light theme, which is selectable in the navigation bar.

## Admin Instruction

For admin, only the profile page is different from the user (features of other pages will be shown with user interactions)

### * Admin Profile

1. Click `Sign In` button in navigation bar, then you will be able to log in. To log in as admin, use
   * username: "admin"
   * password: "admin"
2. After log in, you will  be able to see a profile icon in the rightmost side of navigation bar.
3. Click on the profile icon, you will be directed to admin profile page.
4. You will see the basic admin info at the left side, and there are two input boxes. You can delete users and posts based on the user id and post id. If you enter invalid user id or post id, "This user /post id is not exists" will be showed under the boxes.  
   * Valid user id: "0823170644", "0823170645"
   * Valid post id: "19ibDhy5ft", "nIt38vzpz3"
5. You will see 4 panels at right (number visited, number hit, number posts, number users).
6. After you delete a user, it will automatically delete the posts that user have and delete the attachments and comments for each post. Also, the number of user, which showed in one of the right panels, will be decreased by 1, and the number of posts will be decrease by the number of posts that the user owns.
7. After you delete a post, it will delete the attachments and comments for that single post, and the number of post will be decrease by 1.
8. You can log out by clicking the `Logout` button beside user profile icon.
9. You can go to home page by clicking the left most icon `shareEx`

## User Instruction

### * User Profile

1. Click `Sign In` button in navigation bar, then you will be able to log in. To log in as user, use
   - username: "user"
   - password: "user"
2. After log in, you will  be able to see a profile icon in the rightmost side of navigation bar.
3. Click on the profile icon, you will be directed to user profile page.
4. You will see a banner on the top, and some user stats under the banner. And there will be some user information displayed at the left of the page and their corresponding posts at right of the page.
5. When you click profile setting, you will be direct to the profile setting page.
6. When you click see details below each post, you will be direct to single post page.
7. You can like each of your own post at most once.

## About Other Commonly Used Pages

### * Login

1. Sign in button is displayed in navigation bar whenever user is not logged in (disappear after login)

2. By default, 3 users are added when the app starts.

   | username | password |
   | -------- | -------- |
   | admin    | admin    |
   | user     | user     |
   | user2    | user2    |

3. Wrong password or non-existent user cannot login

### * Sign Up

1. Click on the sign up button in navigation bar to sign up, after signed up, user will be logged in automatically.
2. If the username already exists, one cannot sign up.

### * Profile Setting Page

1. To access this page, you need to login as a normal user (not admin), and click the "Profile Setting" button on the "User Profile" page.
2. On this page, you can change your avatar, nickname, password, and some other infomation.
3. Email must be in the correct format; nickname and password cannot be empty.
4. Click on the password inputbox will delete whatever is in there.
5. There are three buttons at the bottom. Reset reload the user info form server. Cancel goes back to user profile page and ignores whatever have been changed.
6. Save checks if all the inputs are valid. If not valid, the inputbox that contains invalid info will turn red. Otherwise, the changed info are saved to the server, and you will return to "User Profile" page.

### * Single Post

1. On home page or user profile page, click on `See Details` or title to enter `single_post` page.
2. You must click on a post's link to enter the `single_post` page. If you paste the URL to another window, the app doesn't know which post you want to see, and you will be directed to home page
3. Details of a post is displayed on this page.
4. At the bottom, there is a comment section. Users can make comment if they are signed in. 
5. For each comment, if the comment belongs to the current logged in user, `Delete` and `Edit` button are displayed, and you can delete or edit the comment. If you don't own a comment, you would not be able to delete or edit it.
6. You can click icon showed at the right side of the page. That is the owner of the post, and by clicking the icon, you will be direct to `other profile` page, which showed the info of the post owner. You can only like the posts here or follow that user (The following functionality is not working right now because we need server code to implement this functionality).

### * New Post

### * Home

1. All posts are displayed on this page under posts
2. Recommendations are those posts who have over 10 likes, and at most 10 are displayed. 
   - Since every user (excluding admin) can only like each post once, and we have only 2 regular users, it's impossible for a post to have 10 likes, we hardcoded one of the post to have 25 likes in order to have some post displayed.
   - If you want to test this feature, you can login to admin, and like a post as many times as you want, once it reaches 10 likes, the post will be displayed in recommendations.
3. You can click the title of each post, or the `See Details` button inside it to go to this post's details on `single_post` page.
4. For each post, the description is displayed, and if a post contains images, at most 5 of the images would be displayed. If it has more than 5 images, all images and other attachments to the post would be displayed in the post's `single_post` page.














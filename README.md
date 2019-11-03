# team21

### Team member

* Jiatao Xiang (xiangji5), git log name (Jiatao xiang, Jato xiang)

# Instruction

Run `npm start`, then you will be direct to our homepage.

## Admin Instruction

For admin, only the profile page is different from the user (features of other pages will be show under user instructions)

### * Admin Profile

1. Click `Sign In` button in navigation bar, then you will be able to log in. To log in as admin, use
   * username: "admin"
   * password: "admin"
2. After log in, you will  be able to see a profile icon in the rightmost side of navigation bar.
3. Click on the profile icon, you will be directed to admin profile page.
4. You will see the basic admin info at the left side, and there are two input boxes. You can delete users and posts based on the user id and post id.
5. You will see a slideshow panel that contain 4 slides (number visited, number hit, number posts, number users).
6. After you delete a user, it will automatically delete the posts that user have and delete the attachments and comments for each post. Also, the number of user, which showed in the sideshow panel, will be decreased by 1, and the number of posts (also in sideshow panel) will be decrease by the number of posts that the user owns.
7. After you delete a post, it will delete the attachments and comments for that single post, and the number of post will be decrease by 1.
8. You can log out by clicking the `Logout` button beside user profile icon.

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

### * Profile Setting Page

1. To access this page, you need to login as a normal user (not admin), and click the "Profile Setting" button on the "User Profile" page.
2. On this page, you can change your avatar, nickname, password, and some other infomation.
3. Email must be in the correct format; nickname and password cannot be empty.
4. Click on the password inputbox will delete whatever is in there.
5. There are three buttons at the bottom. Reset reload the user info form server. Cancel goes back to user profile page and ignores whatever have been changed.
6. Save checks if all the inputs are valid. If not valid, the inputbox that contains invalid info will turn red. Otherwise, the changed info are saved to the server, and you will return to "User Profile" page.

### * Single Post

### * New Post

### * Home












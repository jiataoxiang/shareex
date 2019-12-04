# Phase2

## Deployment

https://shareex.huakunshen.com/

### Run the app

cd into phase2 folder

```
npm install
cd client npm install
npm start
cd ..
npm start
```





## Connect db through shell

`mongo "mongodb+srv://shareex-36p7c.mongodb.net/test" --username dev`
password: `dev`



#### Home Page

All latest posts (limit to be 100) are displayed by default. 2 filters: category and sort by can be applied to find the posts you want. 

The search bar in the navbar can be used to search for posts and user by their title/username from anywhere in the app. After 

#### Create a new post.

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

#### Edit a post

User can only edit his/her own post by clicking into the post he/she wants to modify, and click the green `Edit` button. This will direct user to the edit page. In the edit page, user can modify any parts of his/her post exactly like in the new post page. Click `Submit` after editing, and the modified post will be stored to database. Notice: a user will only be able to edit his/her own post.

#### Comment on a post

User can write comments on a post by clicking into the post and click `New Comment` button to write comments and click `Submit` to upload the comment. User can write multiple comments on other's and his/her own posts.

#### Edit & Delete a comment

A user will only be able to edit and delete his/her own comments on any posts.

#### Report a post

User can report a post by clicking `Report Post` button located on the right side of the post page. User is required provide report message/reasons. Otherwise, the report will not be performed.

#### Favourite a post

User can favorite a post of others' by clicking the `Favourite` button  located on the right side of the post page. After clicking this button, the button will become transparent, and it cannot be clicked again. Notice: user will not be able to report or favourite his/her own post.
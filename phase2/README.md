# Phase2

## commands for development

Running the app with debug mode: `DEBUG=phase2:* npm start`
`phase2` is the app running and to have log displayed, \* means turn on all logs

## Connect db through shell

`mongo "mongodb+srv://shareex-36p7c.mongodb.net/test" --username dev`
password: `dev`

when server return info, use this format:

```json
res.json{
  message: "message",
  otherData: otherData
}
```

always use message instead of msg





### Create a new post.

After you log in to your account. You could click the `New Post` button in the navber. Users are required to provide information `Title` and `Content` fields. The `Category` field has default option: `Computer Science`. If user leave any of `Title` or `Content` fields empty, the post will not be allowed to submit. 

**Add attachments**

* User can choose to add text, image link, YouTube link, local image file and local PDF file by clicking the green `Add` button, and choose the attachment type in the dropdown menu.
* Each time a new attachment is added, a new green `Add` button will be added right below the item. This allows user to insert items at any position.
* Besides adding items, there is a red `Delete` button under each added attachments. User can delete the one they want.
* If user use the same uploader box to upload multiple numltiple links or local files, the new one will be stacked over the previous.
* After user click the blue `Submit` button located at the bottom right of the page. All data of this post will be added to the database.

### Delete a post
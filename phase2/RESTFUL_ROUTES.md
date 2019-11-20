# RESTFUL ROUTES

| Name    | URL            | Verb   | Description                                      |
| ------- | -------------- | ------ | ------------------------------------------------ |
| INDEX   | /dogs          | GET    | Display a list of all dogs                       |
| NEW     | /dogs/new      | GET    | Displays form to make  new dog                   |
| CREATE  | /dogs          | POST   | Add new dog to DB                                |
| SHOW    | /dogs/:id      | GET    | Shows info about one dog                         |
| EDIT    | /dogs/:id/edit | GET    | Show edit form for one dog                       |
| UPDATE  | /dogs/:id      | PUT    | Update a particular dog, then redirect somewhere |
| DESTROY | /dogs/:id      | DELETE | Delete a particular dog, then redirect somewhere |


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

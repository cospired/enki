# db

# messageStore

* loadMessageStore
  * messageStore doesnt exist
  * messageStore invalid JSON

* init
  * messageStore invalid object(s)

* compareWithICUMessages
  * new message
  * missing message
  * changed message
    * changed defaultMessage -> mark translations fuzzy
    * location changed

* mergeWithICUMessage

* updateMessageTranslation -> always get the full translation object
  * set translation
    * set updatedAt
    * unset fuzzy
  * unset translation
    * set deletedAt
  * set whitelist
  * set inheritFrom

## icu

* loadMessages
  * path not found
  * found duplicate message
  * found invalid message

## exit codes

* if duplicate messages, exit code >0
* if any language needs attention and in report mode, exit code >0

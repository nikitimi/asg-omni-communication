Reference for creating credentials in Google Developer specifically for Gmail right [here](https://developers.google.com/gmail/api/quickstart/nodejs).

#### Email (Gmail)

- Reading(WIP show history box)
- Inbound and Outbound message with/without attachments.

#### Ingoing and Outgoing voice call

The voice call is not working as it should be but it is working under these conditions:

- The caller must copy the ID of the recipient
- The recipient must answer the call, then copy the caller's ID and also press call
- The caller must answer and press call again
- These should establish the voice call in websocket.

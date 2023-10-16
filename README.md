# manage-iko
## overview
  A project/task and team management platform build using microservices pattern.
  Project is right now split into 3 services - authservice, frontend and projectservice.
  Back-end is done in python django, frontend in Remix(react full stack framework).
  Each service uses its own postgres db which is replicated using CloudnativePG kubernetes cluster.
  Asynchronous communitation is established with rabbit-mq and celery.
## Features(current)
  - Create/edit and delete teams.
  - Invite team members with email link(invitation will be send via email).
## Things that I learned
  Instead of pika use celery or kombu(celery uses kombo for rabbitmq) which will give you connection and producer pools. With pika its a takes more time to setup everything.
  While using remix, use their own cookie management instead of setting cookie in django backend and transfering it to remix and then to end user.
  Plan ahead and do some research on which architecture to follow cuz it will be difficult to change as time goes.
## Pending
  -project management
  

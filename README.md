Festival-Fanatic Application Front-end

(http://imgur.com/qM8J9Cx)

APP LINKS:

- Front-end Repo Link: https://github.com/callmelife/festival-fanatic-front-end
- Back-end Repo Link: https://github.com/callmelife/festival-fanatic-back-end
- Deployed Back-end Link (without 'festivals' at the end of the URL): https://evening-oasis-74949.herokuapp.com/
- Deployed Front-end Link: https://callmelife.github.io/festival-fanatic-front-end/
- Screen shot 1 (shows header & half of a non-editable card): http://imgur.com/qM8J9Cx
- Screen shot 2 (shows editable card): http://imgur.com/obenalz

TECHNOLOGIES USED:
-html
-css
-JavaScript
-Express
-Ember
-bootstrap
-bower
-Heroku

GENERAL APPROACH:
Going into the project I knew that I was less technically skilled with back-end related tasks, so that was the first thing that I tackled. I started from the template, made the relevant changes to my resource's controller, model, and the route.js file. After this I constructed all of the relevant curl requests and tested each of them with my database. After successfully testing the curl requests I was satisfied with my current backend and was ready to move to the front end.

Once I was on the front end, I started developing by checking out to a test branch so that I could play around with generating routes, models, and components (mostly routes and components) in order to solidify my understanding of how they all interact with each other and how data/actions move between them.

Once I was comfortable with my understanding of ember, I started by generating the necessary components/routes needed in order to render a list of all the festivals. After I was able to render the list of festivals, the next thing I started on was creating new festivals. I generated an 'edit' component that I would be able to reuse later for my PATCH functionality, which turned out to be a great decision that saved a lot of time. After the POST functionality and wiring was in place, I then tackled the DELETE functionality. This part wasnt too difficult due to the way that I wanted to delete functionality to work (i.e. each card view has a delete button on the card itself), so essentially all I had to do was create the action routes and set 'listeners' for each action.
Next, I worked on edit - edit wasnt too difficult but took longer than I expected. I was able to reuse the same view that I created for POST so that helped alot.

After all CRUD functionality was in place, I focused on data validation (i.e. setting the conditions on what should render when users are signed in, when users are not signed in, what users can see depending on if they own a festival or not).

After this point I was mainly concerned with stylisic changes and deployment.

INSTALLATION INSTRUCTIONS:
npm install
bower install


USER STORIES:
-Who they are:
  My users are people who want to track and share their experiences at events and/or prepare for upcoming events (in this case music 'festivals'). My app is almost like a public-diary for music festivals; for example, I want my users to create posts for upcoming festivals that they're excited for or be able to create a post for a festival that they've been to so that they can comment on how it was / what they thought of the festival.
-What they want:
  People who use my app are users that want a non-strict format to record their experiences. Alot of the factors surrounding musical events are not 'hard-set', so I wanted to leave the users with the flexibility to decide what infomration they want to include in their posts (i.e. the location of a given music festival may not be revealed until the night of the event, so users are not confined to a certain address format.). Users of this application want to record how an event made them feel, what the thought of the event, and be able to find similiar-minded festival-goers - not necessarily the 'hard-details'/logistics surrounding the event.
-Why:
  Once you've been to a handful of festivals (or the same festival for multiple years), they begin to 'blend' together, especially when the artists perform at multiple shows and for multiple years. This app would be great to record how you felt about a certain festival's artist line-up, if you would go again / recommend it to others, how the festival company handled utilities such as food, beverages, bathrooms, line-control, etc.
-Actual user stories:
  "As a user, I want to be able to:"
    -Post my festival experience, details on that festival, and my opinion on how much I enjoyed it.
    -Allow other users to view my posts and be able to view other's posts on their experiences.
    -View individual festivals
    -View a list of all posted festivals
    -Be able to delete my festival posts
    -Be able to edit my festival posts
    -Have data ownership over my festival posts; meaning that only I can delete or edit the festivals that I posted.
    -User authorization (sign up, sign in, sign out, change password)

WIREFRAME:
- Wireframe Link: http://imgur.com/dclgfH6

PITCH DECK:
https://docs.google.com/presentation/d/1h1UBepztKBnlUjSaCQsBexUZIxh6CtVG8p-YEWGVDMU/edit?usp=sharing

UNSOLVED PROBLEMS / MAJOR HURDLES:
-The largest problem I ran into was post-deployment. Due to some confusion with the ember deployment guide, I had incorrectly set my URL. Specifically, I accidently added '/scripts' to the URL when it shouldnt have been there - meaning that I couldnt sign-in or sign-up because it was attempting to send the request to URL/festivals - which was incorrect. This set me back multiple hours but was an easy fix once I was able to track the origin of the issue.
-I'd like to be able to integrate comment functionality on others' festivals, had to descope this goal due to time.

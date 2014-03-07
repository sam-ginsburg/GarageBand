# Final Project, Part I
If you have any questions, come to Office Hours on Wednesday from 7-9pm at the Link *or* post on Lore and we'll answer them there.

## Objectives
The overall project will have you design a web application using vanilla JavaScript that will allow you to mix and edit sounds. In Part I, we'll lay the foundation on which we'll build that application by starting and abstracting several subsystems.

The systems that are required for Part I are:

- Loading and saving sound files from the browser:
	+ This should be done with the help of the FileSystem APIs.
- Importing sound files from outside of the browser:
	+ All non-sound files should not be recognized and ignored.
	+ There should be a capability to have more than one place to import sounds.
- Playing and stopping the sounds:
	+ If another sound is currently playing as the current one is started, it should be stopped.
	+ On the list, there should be a play/stop button for every available sound.
- Listing and managing available sounds:
	+ The list of sounds should not be stored in the DOM. It should be an object managed by JavaScript.
	+ There should be a capability to have more than one place to have the list of sounds.

One of the issues you should have when you're working on this project is browser security due to the same origin policy. To get around that restriction, we have included `fileserver.py` to run your code.

To use `fileserver.py`:

1. Install `pip`.
2. `pip install Flask`
3. Make sure your `fileserver.py` is in the same directory as your project.
4. `python fileserver.py`

Now you can open your project at the url `localhost:5000`.

## Very Non-Ignorable Readings
- [JavaScript Application Design Presentation](http://bit.ly/wahc-7)
- [JavaScript Module Pattern](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)
- [Exploring the FileSystem APIs](http://www.html5rocks.com/en/tutorials/file/filesystem/)
- [Reading files in JavaScript using the File APIs](http://www.html5rocks.com/en/tutorials/file/dndfiles/)
- [Getting Started with Web Audio API](http://www.html5rocks.com/en/tutorials/webaudio/intro/)
- [Promises in JavaScript](http://www.html5rocks.com/en/tutorials/es6/promises/#!)

## Fun Readings
- [Asynchronous Modules](http://requirejs.org/docs/whyamd.html)
- [Events: First Answer to this Question](http://programmers.stackexchange.com/questions/221542/event-driven-vs-reference-driven-programming-i-e-in-javascript)
- [Callbacks vs Promises](https://blog.jcoglan.com/2013/03/30/callbacks-are-imperative-promises-are-functional-nodes-biggest-missed-opportunity/)
- [Callback Hell](http://callbackhell.com/)

## Submission
Submit the link to the repository for your project and your github handle. You should have at least a single commit in that repository (as should all your group members).

Also, remember to add your group leader to the repo, or we won't be able to see it:

- Ben Schwab (@BenSchwab)
- Jason Oettinger (@TheToolbox)
- Arun Karottu (@arunkarottu)

And remember to add your friendly consultant regardless of group =).

- Kirill Klimuk (@kklimuk)
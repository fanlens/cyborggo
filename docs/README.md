# Invitation to the 1st Tyrolean CyborgGo Tournament: "The Segfaultening"
![CyborGo 1: The Segfaultening](/assets/img/cyborgo1_segfaultening.png)

As some of you probably know already we're planning a Go Tournament. It is called CyborgGo because any combination of Human(s) and AI Players may participate.
Here's a quick write up of the rules and framework we will use for the tournament.
We are still in negotiations with sponsors to provide a small price for the first place, the more teams sign up though, the easier the negotiations will be :)

The minimum requirements to participate are the following:
* successfully connect to the online-go.com platform
* play better than random
* we will use online-go.com as infrastructure
In order to proof this you need show 3 consecutive wins against a RandoGo, a bot that simply plays random moves.
(Player ID of RandoGo TBD)

Depending on how many Teams will participate we will hold some of the preliminaries online and only do the finals with the big group, we'll see.

The ruleset:
* Everything necessary to run the bot (this includes source code, pretrained models, etc.) needs to meet the following requirements:
    * created by the team (reimplementation of a research paper is ok, but don't copy paste)
    * needs to fit into a free/public Github repository <https://help.github.com/articles/what-is-my-disk-quota/>
    * needs to be uploaded to Github before the Deadline
    * needs to be licensed with an open source license, e.g. BSD, MIT, Apache, etc.
    * Adherence will be ensured by peer review
* Counting Rules: Japanese 
* Boardsize: 13x13
* Timelimit: 30s per move (Note: we switched it the time per move to 30s for now, depending on amount of teams and how we'll plan the day this might change, so please keep it parametric.)
* Any combination of Human(s) / AI is allowed

The Deadline for registration will probably be end of August (TBD as soon as Sponsorship etc. is more clear).
After the deadline we will have 1-2 weeks of time to peer review the contestants.

Please register your team at: <http://doodle.com/poll/sds793hkurkmi9gp>

The promised Python skeleton unfortunately is not ready yet due to version mismatches of the socket.io api of online-go.com and the Python libraries, paired with Christian wanting to relax a bit on the weekend ;)
If you want to develop in node.js however it seems to work.
The api can be found here: <https://ogs.readme.io/docs/real-time-api>
BE ADVISED: <ggs.online-go.com> has been retired, connect to online-go.com directly and enforce a 'websocket' transport in your library of choice, e.g.
```SocketIO('https://online-go.com/', port=443, transports=['websocket'])```

All updates can also be found on:
<http://cyborggo.ml>


# radio-nachos

Somewhat brittle demo at [https://radio-nachos.herokuapp.com/](https://radio-nachos.herokuapp.com/)

It should work, but _don't_:

- rename a playlist in Spotify. Leave the 'radio-nachos-12345677' name as-is (the number is a timestamp and id)
- delete the playlist anywhere other than in this app (won't break your Spotify but this app won't work, I suspect. It's a Spotify/database mismatch thing)

A playlist maker... from playlists

I was thinking about college radio and how the best (IMO) stations/students play a mix of old-school "college rock" and more recent indie/rock/pop.
They throw in weird stuff, because all college DJs do, but they don't over-do it.

I was also looking at the Spotify API and thinking it would be fun to play with.

So the idea here is that you put in some playlists and some percentages, and you get back a playlist randomly generated from those playlists. My
initial hard-coded version was something like "50% from a huge 80s-alternative list, 35% from a 00-10s indie playlist, 5%
bossanova, 5% from an old-school Memphis R&B playlist, and 5% videogame music."

Needs work.

TLDR another dumb thing.

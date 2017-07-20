import React from 'react'

export const Index = () => (
  <div className={'indexContainer'}>
    <h1><a href='/'>quartetophone</a></h1>
    <h4>an interactive live performance work by <a href="https://twitter.com/nickwarner">@nickwarner</a></h4>

    <h3><a className={'playButton'} href='/manipulators/new'>play along</a></h3>

    <h4><a href='/about'>About the work ♪♪</a></h4>
  </div>
)

export const About = () => (
  <div className={'indexContainer'}>
    <h1><a href='/'>quartetophone</a></h1>
    <h3>about the work</h3>
    <p>
      Artist Nick Warner presents "quartetophone", a live performance of his "four.parts" real-time collaborative music making experience. <a href="https://www.facebook.com/volarequartet">Lexington's Volare String Quartet</a> will play a constantly changing composition based on the input of audience members from their mobile devices. Audience members will be instructed to open this website on their phone. This will give them command of one measure of the score allowing them to choose the notes they'd like for the performer to play. Meanwhile, the input from the mobile devices is translated live into sheet music on tablet computers for the performers to play. "quartetophone" moves the composition of live music to the audience itself to create immediate feedback and iterative, collaborative music and empowers the audience to make an intimate connection with the performers.
    </p>
  </div>
)

export const Admin = () => (
  <div className={'indexContainer'}>
    <h1><a href='/'>quartetophone</a></h1>
    <h3>secret admin dashboard</h3>
    <h2>
      <a href='/everyone'>All players at once</a><br />
      <a href='/players/1'>Player 1</a><br />
      <a href='/players/2'>Player 2</a><br />
      <a href='/players/3'>Player 3</a><br />
      <a href='/players/4'>Player 4</a><br />
      <a href='/manipulators'>current manipulators</a><br />
    </h2>
  </div>
)

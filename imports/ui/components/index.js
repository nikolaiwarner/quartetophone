import React from 'react'

export const Index = () => (
  <div className={'indexContainer'}>
    <h1><a href='/'>quartetophone</a></h1>
    <h4>an interactive live performance work by <a href="https://twitter.com/nickwarner">@nickwarner</a></h4>

    <h3><a className={'playButton'} href='/manipulators/new'>play along</a></h3>

    <h4><a href='/about'>♪♪ About the work ♪♪</a></h4>
  </div>
)

export const About = () => (
  <div className={'indexContainer'}>
    <h1><a href='/'>quartetophone</a></h1>
    <h3>about the work</h3>
    <p>
      <strong>July 21, 2017 - The Living Arts & Science Center, Lexington, KY:</strong>
      <br />
      Artist Nick Warner presents "quartetophone", a live performance of his "four.parts" real-time collaborative music making experience. A live string quartet will play a constantly changing composition based on the input of audience members from their mobile devices. Each participating audience member will have command of one measure of the score allowing them to choose the notes they'd like for the performer to play.
      The input from the mobile devices is translated live into sheet music on tablet computers for the performers. "quartetophone" moves the composition of live music to the audience itself to create immediate feedback and iterative, collaborative music and empowers the audience to make an intimate connection with the performers.
    </p>

    <p>
      Four big thank yous go to these fantastic organizations:
      <br/>
      <a href="https://www.facebook.com/volarequartet">Volare String Quartet</a>
      <br/>
      <a href="http://rulesandplay.org/">Rules and Play Interactive Art Exhibition</a>
      <br/>
      <a href="http://runjumpdev.org/">RunJumpDev</a>
      <br/>
      <a href="https://www.lasclex.org/">The Living Arts & Science Center</a>
    </p>

    <h3>about the artist</h3>
    <p>
      Nick Warner is on a mission to move people: excite, entertain, and immerse! He is an artist and a technologist and works to bring those two worlds closer together: making technology and artistic expression more accessible for everyone. Nick seeks out emerging trends and techniques and synthesizes these to guide audiences through thrilling, new technologies and fun, thought-provoking artistic experiences.
      <br/><br/>
      Follow Nick and join the fun over here:
      <br/><br/>
      <a href="https://twitter.com/nickwarner">https://twitter.com/nickwarner</a>
      <br/>
      <a href="https://www.instagram.com/nikolaiwarner/">https://www.instagram.com/nikolaiwarner/</a>
      <br/>
      <a href="https://github.com/nikolaiwarner">https://github.com/nikolaiwarner</a>
    </p>

    <p>
      ♪♪♪♪
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
      <a href='/gohere'>where to go to</a><br />
      <a href='/about'>about</a><br />
    </h2>
  </div>
)

export const Signage = () => (
  <div className={'indexContainer centerEverything'}>
    <h1><a href='/'>quartetophone</a></h1>

    <h3>play along! on your phone go to:</h3>
    <div className='large'>
      http://four.parts
    </div>
  </div>
)

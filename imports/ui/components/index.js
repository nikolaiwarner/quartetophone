import React from 'react'

export const Index = () => (
  <div className={'indexContainer'}>
    <h1>quartetophone</h1>
    <h4>an interactive live performance work by <a href="https://twitter.com/nickwarner">@nickwarner</a></h4>

    <h3><a className={'playButton'} href='/manipulators/new'>play along</a></h3>

    <h4><a href='/about'>About the work ♪♪</a></h4>
  </div>
)

export const About = () => (
  <div className={'indexContainer'}>
    <h1>quartet-o-phone</h1>
    <h3>about the work</h3>
    <div>
      asdfghjk
    </div>
  </div>
)

export const Admin = () => (
  <div className={'indexContainer'}>
    <h1>four.parts</h1>
    <h3>secret admin dashboard</h3>
    <h2>
      <a href='/manipulators'>current manipulators</a><br />
      <a href='/players/1'>Player 1</a><br />
      <a href='/players/2'>Player 2</a><br />
      <a href='/players/3'>Player 3</a><br />
      <a href='/players/4'>Player 4</a><br />
    </h2>
  </div>
)

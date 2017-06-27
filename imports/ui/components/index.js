import React from 'react'

export const Index = () => (
  <div className={'indexContainer'}>
    <h1>four.parts</h1>
    <h3><a className={'playButton'} href='/manipulators/new'>play along</a></h3>
    <h4>an interactive live performance work by <a href="http://nwarner.com">nick warner</a></h4>
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

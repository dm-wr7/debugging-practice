import React from 'react';
import AddTreasure from './AddTreasure';

export default function Treasure() {
  const treasure = props.treasure.map((item) => {
    <img src={item.url} key={index} alt="" />;
  });
  return (
    <div>
      {props.addMyTreasure ? <AddTreasure addMyTreasure={props.addMyTreasure}/> : null}
      {treasure}
    </div>
  );
}

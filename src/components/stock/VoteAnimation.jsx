import React, { useState, useEffect } from "react";
import coinImg from "/img/coin.png";

const useCoinAnimation = (width, height, isAnimating) => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    let interval;

    if (isAnimating) {
      const generateCoins = () => {
        const newCoins = Array.from({ length: 30 }).map(() => ({
          x: Math.random() * width,
          y: -100,
          speed: Math.random() * 20 + 10,
          size: Math.random() * 100 + 50,
          id: Math.random(),
          angle: Math.random() * 2 * Math.PI,
        }));
        setCoins(newCoins);
      };

      const updateCoins = () => {
        setCoins((prevCoins) => {
          return prevCoins
            .map((coin) => {
              return {
                ...coin,
                y: coin.y + coin.speed,
                angle: coin.angle + 0.05,
              };
            })
            .filter((coin) => coin.y < height);
        });
      };

      generateCoins();

      interval = setInterval(() => {
        updateCoins();
      }, 30);
    }

    return () => clearInterval(interval);
  }, [isAnimating, width, height]);

  return coins;
};

export const VoteGoodAnimation = ({ isAnimating }) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const coins = useCoinAnimation(width, height, isAnimating);
  const coinImage = coinImg;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {coins.map((coin) => (
        <img
          key={coin.id}
          src={coinImage}
          alt="Coin"
          className="absolute"
          style={{
            left: coin.x,
            top: coin.y,
            transform: `rotate(${coin.angle}rad)`,
            width: `${coin.size}px`,
            height: `${coin.size}px`,
            zIndex: 10,
          }}
        />
      ))}
    </div>
  );
};

const makeItRain = (setRaindrops) => {
  let increment = 0;
  let drops = "";
  let backDrops = "";

  while (increment < 100) {
    const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1); // 1~98
    const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2); // 2~5
    increment += randoFiver;

    drops += `<div class="drop" style="left: ${increment}%; bottom: ${
      randoFiver + randoFiver - 1 + 100
    }%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
                <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
              </div>`;
    backDrops += `<div class="drop" style="right: ${increment}%; bottom: ${
      randoFiver + randoFiver - 1 + 100
    }%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
                   <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                   <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                 </div>`;
  }

  // Update the raindrops state
  setRaindrops({ drops, backDrops });
};

export const VoteBadAnimation = ({ isAnimating }) => {
  const [raindrops, setRaindrops] = useState({ drops: "", backDrops: "" });

  useEffect(() => {
    if (isAnimating) {
      makeItRain(setRaindrops);
    }
  }, [isAnimating]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Front row raindrops */}
      <div className="rain front-row absolute top-0 left-0 w-full h-full z-10">
        {raindrops.drops}
      </div>
      {/* Back row raindrops */}
      <div className="rain back-row absolute top-0 left-0 w-full h-full z-5">
        {raindrops.backDrops}
      </div>
    </div>
  );
};
